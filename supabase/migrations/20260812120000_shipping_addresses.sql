-- Move shipping addresses out of the world-readable profiles table.
--
-- profiles carries "Public profile access" (FOR SELECT USING (true)) so that
-- anyone can browse seller profiles. RLS is row-level, so that policy also
-- handed out profiles.shipping_address -- full name, street, postcode, phone --
-- to any caller holding the anon key, which ships in the client bundle.
--
-- Addresses live in their own table instead, owner-only, with no anon grant.

create table public.shipping_addresses (
  user_id uuid primary key references auth.users(id) on delete cascade,
  address jsonb not null
);

alter table public.shipping_addresses enable row level security;

create policy "Users manage own shipping address"
  on public.shipping_addresses
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update, delete on table public.shipping_addresses to authenticated;
grant all on table public.shipping_addresses to service_role;

-- ALTER DEFAULT PRIVILEGES in the initial schema grants anon ALL on every new
-- public table, so the grant has to be taken back explicitly. RLS already
-- denies anon (the policy above is authenticated-only); this makes the table
-- unreachable a privilege level lower too.
revoke all on table public.shipping_addresses from anon;

insert into public.shipping_addresses (user_id, address)
select id, shipping_address
from public.profiles
where shipping_address is not null;

alter table public.profiles drop column shipping_address;
