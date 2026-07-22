-- Indexes supporting the recommendation ranking (get_ranked_listings).
-- Foreign keys are not auto-indexed in Postgres; the CF/attribute path reads
-- orders by buyer_id and joins by listing_id, and reads recent activity by user.

create index if not exists idx_orders_buyer_id
  on public.orders using btree (buyer_id);

create index if not exists idx_orders_listing_id
  on public.orders using btree (listing_id);

-- activity is currently empty; these support the per-user affinity read and the
-- per-listing recent-view velocity once view-tracking is instrumented.
create index if not exists idx_activity_user_type_created
  on public.activity using btree (user_id, type, created_at desc);

create index if not exists idx_activity_listing_type_created
  on public.activity using btree (listing_id, type, created_at desc);
