create or replace function public.get_guest_recommendations(num_recommendations integer default 100)
returns table(listing_id uuid, score double precision)
language sql stable security definer
set search_path to ''
as $$
  with favorite_counts as (
    select f.listing_id, count(*)::double precision as favorite_count
    from public.favorites f
    group by f.listing_id
  )
  select
    l.id as listing_id,
    (
      coalesce(fc.favorite_count, 0)
      + case
          when l.created_at >= now() - interval '7 days' then 1.5
          when l.created_at >= now() - interval '30 days' then 0.75
          else 0
        end
    )::double precision as score
  from public.listings l
  left join favorite_counts fc on fc.listing_id = l.id
  where l.status = 'active'
  order by score desc, l.created_at desc
  limit num_recommendations;
$$;

alter function public.get_guest_recommendations(integer) owner to postgres;

grant all on function public.get_guest_recommendations(integer) to anon;
grant all on function public.get_guest_recommendations(integer) to authenticated;
grant all on function public.get_guest_recommendations(integer) to service_role;
