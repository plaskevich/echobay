drop extension if exists "pg_net";


  create table "public"."activity" (
    "id" bigint generated always as identity not null,
    "user_id" uuid,
    "listing_id" uuid,
    "type" text,
    "created_at" timestamp without time zone default now()
      );


alter table "public"."activity" enable row level security;


  create table "public"."favorites" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "listing_id" uuid not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."favorites" enable row level security;


  create table "public"."genres" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "slug" text not null,
    "display_order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "parent_id" uuid
      );


alter table "public"."genres" enable row level security;


  create table "public"."listing_genres" (
    "listing_id" uuid not null,
    "genre_id" uuid not null
      );


alter table "public"."listing_genres" enable row level security;


  create table "public"."listings" (
    "id" uuid not null default gen_random_uuid(),
    "owner_id" uuid,
    "title" text not null,
    "artist" text not null,
    "format" text not null,
    "genre" text,
    "label" text,
    "price" numeric not null,
    "condition" text,
    "description" text,
    "images" text[],
    "created_at" timestamp without time zone default now(),
    "status" text not null default 'active'::text
      );


alter table "public"."listings" enable row level security;


  create table "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "listing_id" uuid,
    "buyer_id" uuid,
    "shipping_address" jsonb not null,
    "amount" numeric(10,2) not null,
    "stripe_payment_intent_id" text,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."orders" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "username" text,
    "avatar_url" text,
    "created_at" timestamp without time zone default now(),
    "about" text,
    "location" text
      );


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX activity_pkey ON public.activity USING btree (id);

CREATE UNIQUE INDEX favorites_pkey ON public.favorites USING btree (id);

CREATE UNIQUE INDEX favorites_user_id_listing_id_key ON public.favorites USING btree (user_id, listing_id);

CREATE UNIQUE INDEX genres_name_key ON public.genres USING btree (name);

CREATE UNIQUE INDEX genres_pkey ON public.genres USING btree (id);

CREATE UNIQUE INDEX genres_slug_key ON public.genres USING btree (slug);

CREATE INDEX idx_favorites_listing_id ON public.favorites USING btree (listing_id);

CREATE INDEX idx_favorites_user_id ON public.favorites USING btree (user_id);

CREATE INDEX idx_genres_display_order ON public.genres USING btree (display_order);

CREATE INDEX idx_genres_parent_id ON public.genres USING btree (parent_id);

CREATE INDEX idx_genres_slug ON public.genres USING btree (slug);

CREATE INDEX idx_listing_genres_genre_id ON public.listing_genres USING btree (genre_id);

CREATE INDEX idx_listing_genres_listing_id ON public.listing_genres USING btree (listing_id);

CREATE INDEX idx_listings_status ON public.listings USING btree (status);

CREATE INDEX idx_listings_status_created_at ON public.listings USING btree (status, created_at DESC);

CREATE UNIQUE INDEX listing_genres_pkey ON public.listing_genres USING btree (listing_id, genre_id);

CREATE UNIQUE INDEX listings_pkey ON public.listings USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX orders_stripe_payment_intent_id_key ON public.orders USING btree (stripe_payment_intent_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

alter table "public"."activity" add constraint "activity_pkey" PRIMARY KEY using index "activity_pkey";

alter table "public"."favorites" add constraint "favorites_pkey" PRIMARY KEY using index "favorites_pkey";

alter table "public"."genres" add constraint "genres_pkey" PRIMARY KEY using index "genres_pkey";

alter table "public"."listing_genres" add constraint "listing_genres_pkey" PRIMARY KEY using index "listing_genres_pkey";

alter table "public"."listings" add constraint "listings_pkey" PRIMARY KEY using index "listings_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."activity" add constraint "activity_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE not valid;

alter table "public"."activity" validate constraint "activity_listing_id_fkey";

alter table "public"."activity" add constraint "activity_type_check" CHECK ((type = ANY (ARRAY['view'::text, 'wishlist'::text, 'purchase'::text]))) not valid;

alter table "public"."activity" validate constraint "activity_type_check";

alter table "public"."activity" add constraint "activity_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."activity" validate constraint "activity_user_id_fkey";

alter table "public"."favorites" add constraint "favorites_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE not valid;

alter table "public"."favorites" validate constraint "favorites_listing_id_fkey";

alter table "public"."favorites" add constraint "favorites_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."favorites" validate constraint "favorites_user_id_fkey";

alter table "public"."favorites" add constraint "favorites_user_id_listing_id_key" UNIQUE using index "favorites_user_id_listing_id_key";

alter table "public"."genres" add constraint "genres_name_key" UNIQUE using index "genres_name_key";

alter table "public"."genres" add constraint "genres_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.genres(id) ON DELETE SET NULL not valid;

alter table "public"."genres" validate constraint "genres_parent_id_fkey";

alter table "public"."genres" add constraint "genres_slug_key" UNIQUE using index "genres_slug_key";

alter table "public"."listing_genres" add constraint "listing_genres_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE not valid;

alter table "public"."listing_genres" validate constraint "listing_genres_genre_id_fkey";

alter table "public"."listing_genres" add constraint "listing_genres_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE not valid;

alter table "public"."listing_genres" validate constraint "listing_genres_listing_id_fkey";

alter table "public"."listings" add constraint "listings_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."listings" validate constraint "listings_owner_id_fkey";

alter table "public"."listings" add constraint "listings_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'hidden'::text, 'sold'::text]))) not valid;

alter table "public"."listings" validate constraint "listings_status_check";

alter table "public"."orders" add constraint "orders_buyer_id_fkey" FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_buyer_id_fkey";

alter table "public"."orders" add constraint "orders_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_listing_id_fkey";

alter table "public"."orders" add constraint "orders_stripe_payment_intent_id_key" UNIQUE using index "orders_stripe_payment_intent_id_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

grant delete on table "public"."activity" to "anon";

grant insert on table "public"."activity" to "anon";

grant references on table "public"."activity" to "anon";

grant select on table "public"."activity" to "anon";

grant trigger on table "public"."activity" to "anon";

grant truncate on table "public"."activity" to "anon";

grant update on table "public"."activity" to "anon";

grant delete on table "public"."activity" to "authenticated";

grant insert on table "public"."activity" to "authenticated";

grant references on table "public"."activity" to "authenticated";

grant select on table "public"."activity" to "authenticated";

grant trigger on table "public"."activity" to "authenticated";

grant truncate on table "public"."activity" to "authenticated";

grant update on table "public"."activity" to "authenticated";

grant delete on table "public"."activity" to "service_role";

grant insert on table "public"."activity" to "service_role";

grant references on table "public"."activity" to "service_role";

grant select on table "public"."activity" to "service_role";

grant trigger on table "public"."activity" to "service_role";

grant truncate on table "public"."activity" to "service_role";

grant update on table "public"."activity" to "service_role";

grant delete on table "public"."favorites" to "anon";

grant insert on table "public"."favorites" to "anon";

grant references on table "public"."favorites" to "anon";

grant select on table "public"."favorites" to "anon";

grant trigger on table "public"."favorites" to "anon";

grant truncate on table "public"."favorites" to "anon";

grant update on table "public"."favorites" to "anon";

grant delete on table "public"."favorites" to "authenticated";

grant insert on table "public"."favorites" to "authenticated";

grant references on table "public"."favorites" to "authenticated";

grant select on table "public"."favorites" to "authenticated";

grant trigger on table "public"."favorites" to "authenticated";

grant truncate on table "public"."favorites" to "authenticated";

grant update on table "public"."favorites" to "authenticated";

grant delete on table "public"."favorites" to "service_role";

grant insert on table "public"."favorites" to "service_role";

grant references on table "public"."favorites" to "service_role";

grant select on table "public"."favorites" to "service_role";

grant trigger on table "public"."favorites" to "service_role";

grant truncate on table "public"."favorites" to "service_role";

grant update on table "public"."favorites" to "service_role";

grant delete on table "public"."genres" to "anon";

grant insert on table "public"."genres" to "anon";

grant references on table "public"."genres" to "anon";

grant select on table "public"."genres" to "anon";

grant trigger on table "public"."genres" to "anon";

grant truncate on table "public"."genres" to "anon";

grant update on table "public"."genres" to "anon";

grant delete on table "public"."genres" to "authenticated";

grant insert on table "public"."genres" to "authenticated";

grant references on table "public"."genres" to "authenticated";

grant select on table "public"."genres" to "authenticated";

grant trigger on table "public"."genres" to "authenticated";

grant truncate on table "public"."genres" to "authenticated";

grant update on table "public"."genres" to "authenticated";

grant delete on table "public"."genres" to "service_role";

grant insert on table "public"."genres" to "service_role";

grant references on table "public"."genres" to "service_role";

grant select on table "public"."genres" to "service_role";

grant trigger on table "public"."genres" to "service_role";

grant truncate on table "public"."genres" to "service_role";

grant update on table "public"."genres" to "service_role";

grant delete on table "public"."listing_genres" to "anon";

grant insert on table "public"."listing_genres" to "anon";

grant references on table "public"."listing_genres" to "anon";

grant select on table "public"."listing_genres" to "anon";

grant trigger on table "public"."listing_genres" to "anon";

grant truncate on table "public"."listing_genres" to "anon";

grant update on table "public"."listing_genres" to "anon";

grant delete on table "public"."listing_genres" to "authenticated";

grant insert on table "public"."listing_genres" to "authenticated";

grant references on table "public"."listing_genres" to "authenticated";

grant select on table "public"."listing_genres" to "authenticated";

grant trigger on table "public"."listing_genres" to "authenticated";

grant truncate on table "public"."listing_genres" to "authenticated";

grant update on table "public"."listing_genres" to "authenticated";

grant delete on table "public"."listing_genres" to "service_role";

grant insert on table "public"."listing_genres" to "service_role";

grant references on table "public"."listing_genres" to "service_role";

grant select on table "public"."listing_genres" to "service_role";

grant trigger on table "public"."listing_genres" to "service_role";

grant truncate on table "public"."listing_genres" to "service_role";

grant update on table "public"."listing_genres" to "service_role";

grant delete on table "public"."listings" to "anon";

grant insert on table "public"."listings" to "anon";

grant references on table "public"."listings" to "anon";

grant select on table "public"."listings" to "anon";

grant trigger on table "public"."listings" to "anon";

grant truncate on table "public"."listings" to "anon";

grant update on table "public"."listings" to "anon";

grant delete on table "public"."listings" to "authenticated";

grant insert on table "public"."listings" to "authenticated";

grant references on table "public"."listings" to "authenticated";

grant select on table "public"."listings" to "authenticated";

grant trigger on table "public"."listings" to "authenticated";

grant truncate on table "public"."listings" to "authenticated";

grant update on table "public"."listings" to "authenticated";

grant delete on table "public"."listings" to "service_role";

grant insert on table "public"."listings" to "service_role";

grant references on table "public"."listings" to "service_role";

grant select on table "public"."listings" to "service_role";

grant trigger on table "public"."listings" to "service_role";

grant truncate on table "public"."listings" to "service_role";

grant update on table "public"."listings" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";


  create policy "User logs own activity"
  on "public"."activity"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users read only own activity"
  on "public"."activity"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can delete their own favorites"
  on "public"."favorites"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own favorites"
  on "public"."favorites"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view their own favorites"
  on "public"."favorites"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Genres are viewable by everyone"
  on "public"."genres"
  as permissive
  for select
  to public
using (true);



  create policy "Listing genres are viewable by everyone"
  on "public"."listing_genres"
  as permissive
  for select
  to public
using (true);



  create policy "Users can delete listing genres for their own listings"
  on "public"."listing_genres"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.listings
  WHERE ((listings.id = listing_genres.listing_id) AND (listings.owner_id = auth.uid())))));



  create policy "Users can insert listing genres for their own listings"
  on "public"."listing_genres"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.listings
  WHERE ((listings.id = listing_genres.listing_id) AND (listings.owner_id = auth.uid())))));



  create policy "Allow update if owner or confirmed buyer"
  on "public"."listings"
  as permissive
  for update
  to public
using (((owner_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.orders
  WHERE ((orders.listing_id = listings.id) AND (orders.buyer_id = auth.uid()))))));



  create policy "Listings are public"
  on "public"."listings"
  as permissive
  for select
  to public
using (true);



  create policy "Users can create listings"
  on "public"."listings"
  as permissive
  for insert
  to public
with check ((auth.uid() = owner_id));



  create policy "Users can delete own listings"
  on "public"."listings"
  as permissive
  for delete
  to public
using ((auth.uid() = owner_id));



  create policy "Allow buyers and sellers to view orders"
  on "public"."orders"
  as permissive
  for select
  to public
using (((buyer_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.listings
  WHERE ((listings.id = orders.listing_id) AND (listings.owner_id = auth.uid()))))));



  create policy "Users can create orders"
  on "public"."orders"
  as permissive
  for insert
  to public
with check ((auth.uid() = buyer_id));



  create policy "Public profile access"
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Users can insert their own profile"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = id));



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can view their own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Allow all read access"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'listings'::text));



  create policy "Users can delete own files"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((auth.uid() = owner));



  create policy "Users can upload own files"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((auth.role() = 'authenticated'::text));



