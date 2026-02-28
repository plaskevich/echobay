
  create table "public"."ratings" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid not null,
    "buyer_id" uuid not null,
    "seller_id" uuid not null,
    "rating" smallint not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."ratings" enable row level security;

CREATE INDEX ratings_order_id_idx ON public.ratings USING btree (order_id);

CREATE UNIQUE INDEX ratings_order_id_key ON public.ratings USING btree (order_id);

CREATE UNIQUE INDEX ratings_pkey ON public.ratings USING btree (id);

CREATE INDEX ratings_seller_id_idx ON public.ratings USING btree (seller_id);

alter table "public"."ratings" add constraint "ratings_pkey" PRIMARY KEY using index "ratings_pkey";

alter table "public"."ratings" add constraint "ratings_buyer_id_fkey" FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_buyer_id_fkey";

alter table "public"."ratings" add constraint "ratings_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_order_id_fkey";

alter table "public"."ratings" add constraint "ratings_order_id_key" UNIQUE using index "ratings_order_id_key";

alter table "public"."ratings" add constraint "ratings_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."ratings" validate constraint "ratings_rating_check";

alter table "public"."ratings" add constraint "ratings_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."ratings" validate constraint "ratings_seller_id_fkey";

grant delete on table "public"."ratings" to "anon";

grant insert on table "public"."ratings" to "anon";

grant references on table "public"."ratings" to "anon";

grant select on table "public"."ratings" to "anon";

grant trigger on table "public"."ratings" to "anon";

grant truncate on table "public"."ratings" to "anon";

grant update on table "public"."ratings" to "anon";

grant delete on table "public"."ratings" to "authenticated";

grant insert on table "public"."ratings" to "authenticated";

grant references on table "public"."ratings" to "authenticated";

grant select on table "public"."ratings" to "authenticated";

grant trigger on table "public"."ratings" to "authenticated";

grant truncate on table "public"."ratings" to "authenticated";

grant update on table "public"."ratings" to "authenticated";

grant delete on table "public"."ratings" to "service_role";

grant insert on table "public"."ratings" to "service_role";

grant references on table "public"."ratings" to "service_role";

grant select on table "public"."ratings" to "service_role";

grant trigger on table "public"."ratings" to "service_role";

grant truncate on table "public"."ratings" to "service_role";

grant update on table "public"."ratings" to "service_role";


  create policy "Anyone can view ratings"
  on "public"."ratings"
  as permissive
  for select
  to public
using (true);



  create policy "Buyers can create ratings"
  on "public"."ratings"
  as permissive
  for insert
  to public
with check ((auth.uid() = buyer_id));



