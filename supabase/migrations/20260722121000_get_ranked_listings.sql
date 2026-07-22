-- Unified, server-side ranked + filtered + paginated listings feed.
--
-- Replaces the previous "return a score map, re-sort one already-paginated page
-- in memory" approach (which only reordered a page of newest items and never
-- changed which items landed on which page). Ranking now happens across the
-- whole filtered candidate set, then pagination is applied to the ranked order.
--
-- Recommendation model (authed): attribute-based hybrid. A per-user taste
-- profile is built from attribute affinities (artist, genre, label, decade,
-- format, price band) weighted by their interactions (orders, own listings,
-- favorites, views/wishlist). Candidates are scored by attribute overlap,
-- blended with a global popularity/velocity term and a recency bonus. When the
-- profile is empty (new user, or a guest), the attribute term is 0 and the
-- score degrades gracefully to popularity + recency (trending) -- this is the
-- built-in cold-start / guest path.
--
-- Guests pass p_user_id => null and (optionally) p_recent_view_ids, their
-- client-side recently-viewed listing ids, which feed the same attribute
-- machinery as a light view-weight signal.

create or replace function public.get_ranked_listings(
  p_user_id uuid default null,
  p_recent_view_ids uuid[] default '{}',
  p_sort text default 'recommended',
  p_search text default null,
  p_formats text[] default null,
  p_conditions text[] default null,
  p_genre_ids uuid[] default null,
  p_price_min numeric default null,
  p_price_max numeric default null,
  p_year_min integer default null,
  p_year_max integer default null,
  p_exclude_owner uuid default null,
  p_limit integer default 24,
  p_offset integer default 0
)
returns table (
  id uuid,
  owner_id uuid,
  title text,
  artist text,
  year integer,
  format text,
  label text,
  condition text,
  price numeric,
  shipping_price numeric,
  description text,
  images text[],
  status text,
  created_at timestamp without time zone,
  score double precision,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path to ''
as $$
-- The RETURNS TABLE output columns (artist, format, price, created_at, ...) are
-- in-scope names; prefer the actual table column when a bare reference collides.
#variable_conflict use_column
declare
  -- interaction -> affinity weights (strength of each signal)
  w_fav       double precision := 1.0;
  w_order     double precision := 2.0;
  w_own       double precision := 1.5;
  w_view      double precision := 0.3;
  w_wishlist  double precision := 1.0;
  -- attribute-type weights (relative importance of each attribute; music is
  -- artist-dominant, then genre)
  wa_artist   double precision := 3.0;
  wa_genre    double precision := 2.0;
  wa_label    double precision := 1.5;
  wa_decade   double precision := 1.0;
  wa_format   double precision := 0.75;
  wa_band     double precision := 0.5;
  -- final blend (each term is min-max normalized to 0..1 across candidates)
  blend_attr    double precision := 1.0;
  blend_pop     double precision := 0.35;
  blend_recency double precision := 0.2;
  -- popularity / velocity weights
  vw_fav30    double precision := 2.0;
  vw_view30   double precision := 0.2;
  vw_favall   double precision := 0.5;
begin
  p_limit := greatest(coalesce(p_limit, 24), 1);
  p_offset := greatest(coalesce(p_offset, 0), 0);

  return query
  with
  -- multi-term search: AND across tokens, OR across fields, mirroring the
  -- client's buildListingsQuery (per-term .or over title/artist/label/description,
  -- with [,%()] stripped from each token).
  search_tokens as (
    select regexp_replace(t, '[,%()]', '', 'g') as tok
    from regexp_split_to_table(lower(btrim(coalesce(p_search, ''))), '\s+') as t
    where regexp_replace(t, '[,%()]', '', 'g') <> ''
  ),

  -- the target user's interactions (empty for guests / cold-start), unioned
  -- with any guest recently-viewed ids passed from the client.
  raw_interactions as (
    select f.listing_id, w_fav as w
    from public.favorites f
    where p_user_id is not null and f.user_id = p_user_id
    union all
    select o.listing_id, w_order
    from public.orders o
    where p_user_id is not null and o.buyer_id = p_user_id and o.status <> 'failed'
    union all
    select l.id, w_own
    from public.listings l
    where p_user_id is not null and l.owner_id = p_user_id and l.status in ('active', 'sold')
    union all
    select a.listing_id,
           case a.type when 'view' then w_view when 'wishlist' then w_wishlist else 0 end
    from public.activity a
    where p_user_id is not null and a.user_id = p_user_id and a.type in ('view', 'wishlist')
    union all
    select rv, w_view
    from unnest(coalesce(p_recent_view_ids, '{}'::uuid[])) as rv
  ),
  interactions as (
    select listing_id, max(w) as w
    from raw_interactions
    where listing_id is not null
    group by listing_id
  ),
  src as (
    select i.w, l.artist, l.format, l.label, l.price, l.year, (l.year / 10) * 10 as decade
    from interactions i
    join public.listings l on l.id = i.listing_id
  ),
  aff_artist as (select artist as v, sum(w) as a from src where artist is not null group by artist),
  aff_format as (select format as v, sum(w) as a from src where format is not null group by format),
  aff_label  as (select label  as v, sum(w) as a from src where label  is not null group by label),
  aff_decade as (select decade as v, sum(w) as a from src where decade is not null group by decade),
  aff_band   as (select width_bucket(price, array[10, 25, 50, 100, 200]::numeric[]) as v, sum(w) as a from src group by 1),
  aff_genre  as (
    select lg.genre_id as v, sum(i.w) as a
    from interactions i
    join public.listing_genres lg on lg.listing_id = i.listing_id
    group by lg.genre_id
  ),

  -- candidate set: active listings passing all filters, excluding the viewer's
  -- own listings. Filter parity with buildListingsQuery.
  filtered as (
    select l.id, l.owner_id, l.title, l.artist, l.year, l.format, l.label, l.condition,
           l.price, l.shipping_price, l.description, l.images, l.status, l.created_at
    from public.listings l
    where l.status = 'active'
      and (p_exclude_owner is null or l.owner_id is distinct from p_exclude_owner)
      and (p_formats is null or l.format = any(p_formats))
      and (p_conditions is null or l.condition = any(p_conditions))
      and (p_price_min is null or l.price >= p_price_min)
      and (p_price_max is null or l.price <= p_price_max)
      and (p_year_min is null or l.year >= p_year_min)
      and (p_year_max is null or l.year <= p_year_max)
      and (p_genre_ids is null or exists (
            select 1 from public.listing_genres lg
            where lg.listing_id = l.id and lg.genre_id = any(p_genre_ids)))
      and (
        not exists (select 1 from search_tokens)
        or not exists (
          select 1 from search_tokens st
          where not (
            l.title ilike '%' || st.tok || '%'
            or l.artist ilike '%' || st.tok || '%'
            or coalesce(l.label, '') ilike '%' || st.tok || '%'
            or coalesce(l.description, '') ilike '%' || st.tok || '%'
          )))
  ),

  -- global popularity / recent velocity (identical for every viewer)
  pop as (
    select f.id as listing_id,
           coalesce(fc.fav_all, 0)::double precision   as fav_all,
           coalesce(fc.fav_30d, 0)::double precision   as fav_30d,
           coalesce(vc.views_30d, 0)::double precision as views_30d
    from filtered f
    left join (
      select listing_id,
             count(*)::double precision as fav_all,
             count(*) filter (where created_at >= now() - interval '30 days')::double precision as fav_30d
      from public.favorites
      group by listing_id
    ) fc on fc.listing_id = f.id
    left join (
      select listing_id, count(*)::double precision as views_30d
      from public.activity
      where type = 'view' and created_at >= now() - interval '30 days'
      group by listing_id
    ) vc on vc.listing_id = f.id
  ),

  scored_base as (
    select
      f.id, f.owner_id, f.title, f.artist, f.year, f.format, f.label, f.condition,
      f.price, f.shipping_price, f.description, f.images, f.status, f.created_at,
      (
        wa_artist * coalesce((select a from aff_artist where v = f.artist), 0)
        + wa_format * coalesce((select a from aff_format where v = f.format), 0)
        + wa_label  * coalesce((select a from aff_label  where v = f.label), 0)
        + wa_decade * coalesce((select a from aff_decade where v = (f.year / 10) * 10), 0)
        + wa_band   * coalesce((select a from aff_band
                                where v = width_bucket(f.price, array[10, 25, 50, 100, 200]::numeric[])), 0)
        + wa_genre  * coalesce((select sum(g.a) from aff_genre g
                                join public.listing_genres lg on lg.genre_id = g.v
                                where lg.listing_id = f.id), 0)
      ) as attr_raw,
      (
        vw_fav30 * coalesce(p.fav_30d, 0)
        + vw_view30 * coalesce(p.views_30d, 0)
        + vw_favall * ln(1 + coalesce(p.fav_all, 0))
      ) as vel,
      (case
         when f.created_at >= now() - interval '7 days'  then 1.0
         when f.created_at >= now() - interval '30 days' then 0.5
         else 0.0
       end)::double precision as recency
    from filtered f
    left join pop p on p.listing_id = f.id
  ),

  -- normalize each term to 0..1 across the candidate set, then blend.
  blended as (
    select sb.id, sb.owner_id, sb.title, sb.artist, sb.year, sb.format, sb.label, sb.condition,
           sb.price, sb.shipping_price, sb.description, sb.images, sb.status, sb.created_at,
           (
             blend_attr    * (sb.attr_raw / coalesce(nullif(max(sb.attr_raw) over (), 0), 1))
             + blend_pop     * (sb.vel      / coalesce(nullif(max(sb.vel) over (), 0), 1))
             + blend_recency * sb.recency
           ) as score
    from scored_base sb
  ),

  ranked as (
    select b.*,
           row_number() over (
             order by
               (case when p_sort = 'cheapest'       then b.price end) asc  nulls last,
               (case when p_sort = 'most_expensive' then b.price end) desc nulls last,
               (case when p_sort = 'recommended'    then b.score end) desc nulls last,
               b.created_at desc
           ) as rn,
           count(*) over () as total_count
    from blended b
  )
  select r.id, r.owner_id, r.title, r.artist, r.year, r.format, r.label, r.condition,
         r.price, r.shipping_price, r.description, r.images, r.status, r.created_at,
         r.score, r.total_count
  from ranked r
  -- clamp the window so a stale high page (e.g. filters narrowed the result set
  -- after navigation) returns the last real page instead of an empty page.
  where r.rn >  least(p_offset::bigint, ((r.total_count - 1) / p_limit) * p_limit)
    and r.rn <= least(p_offset::bigint, ((r.total_count - 1) / p_limit) * p_limit) + p_limit
  order by r.rn;
end;
$$;

alter function public.get_ranked_listings(uuid, uuid[], text, text, text[], text[], uuid[], numeric, numeric, integer, integer, uuid, integer, integer) owner to postgres;

grant all on function public.get_ranked_listings(uuid, uuid[], text, text, text[], text[], uuid[], numeric, numeric, integer, integer, uuid, integer, integer) to anon;
grant all on function public.get_ranked_listings(uuid, uuid[], text, text, text[], text[], uuid[], numeric, numeric, integer, integer, uuid, integer, integer) to authenticated;
grant all on function public.get_ranked_listings(uuid, uuid[], text, text, text[], text[], uuid[], numeric, numeric, integer, integer, uuid, integer, integer) to service_role;
