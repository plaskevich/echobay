


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_recommendations"("target_user_id" "uuid", "num_recommendations" integer DEFAULT 12) RETURNS TABLE("listing_id" "uuid", "score" double precision)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  WITH
  -- Build user-item interaction matrix:
  --   own listing = 1.5, favorite = 1.0, purchase = 2.0
  raw_interactions AS (
    SELECT f.user_id, f.listing_id AS item_id, 1.0 AS weight
    FROM favorites f
    UNION ALL
    SELECT o.buyer_id AS user_id, o.listing_id AS item_id, 2.0 AS weight
    FROM orders o
    WHERE o.status != 'failed'
    UNION ALL
    SELECT l.owner_id AS user_id, l.id AS item_id, 1.5 AS weight
    FROM listings l
    WHERE l.status IN ('active', 'sold')
  ),
  interactions AS (
    SELECT ri.user_id, ri.item_id, MAX(ri.weight) AS weight
    FROM raw_interactions ri
    GROUP BY ri.user_id, ri.item_id
  ),

  -- Items the target user has interacted with
  user_items AS (
    SELECT i.item_id, i.weight
    FROM interactions i
    WHERE i.user_id = target_user_id
  ),

  -- L2 norm per item (used for cosine similarity denominator)
  item_norms AS (
    SELECT i.item_id, SQRT(SUM(i.weight * i.weight)) AS norm
    FROM interactions i
    WHERE i.item_id IN (SELECT ui.item_id FROM user_items ui)
       OR i.item_id IN (
         SELECT DISTINCT i2.item_id
         FROM interactions i2
         WHERE i2.user_id IN (
           SELECT DISTINCT i3.user_id FROM interactions i3
           WHERE i3.item_id IN (SELECT ui2.item_id FROM user_items ui2)
         )
         AND i2.item_id NOT IN (SELECT ui3.item_id FROM user_items ui3)
       )
    GROUP BY i.item_id
  ),

  -- Dot products between each user item and candidate items
  -- via users who interacted with both
  dot_products AS (
    SELECT
      a.item_id AS user_item_id,
      b.item_id AS candidate_id,
      SUM(a.weight * b.weight) AS dot_product
    FROM interactions a
    INNER JOIN interactions b ON a.user_id = b.user_id
    WHERE a.item_id IN (SELECT ui.item_id FROM user_items ui)
      AND b.item_id NOT IN (SELECT ui.item_id FROM user_items ui)
    GROUP BY a.item_id, b.item_id
  ),

  -- Cosine similarity between each (user_item, candidate) pair
  similarities AS (
    SELECT
      dp.user_item_id,
      dp.candidate_id,
      dp.dot_product / (n1.norm * n2.norm) AS similarity
    FROM dot_products dp
    INNER JOIN item_norms n1 ON n1.item_id = dp.user_item_id
    INNER JOIN item_norms n2 ON n2.item_id = dp.candidate_id
    WHERE n1.norm > 0 AND n2.norm > 0
  ),

  -- Weighted score: score(j) = Σ sim(i,j) * w(user,i) / Σ |sim(i,j)|
  scored AS (
    SELECT
      s.candidate_id AS item_id,
      (SUM(s.similarity * ui.weight) / NULLIF(SUM(ABS(s.similarity)), 0))::DOUBLE PRECISION AS score
    FROM similarities s
    INNER JOIN user_items ui ON ui.item_id = s.user_item_id
    GROUP BY s.candidate_id
  )

  SELECT sc.item_id AS listing_id, sc.score
  FROM scored sc
  INNER JOIN listings l ON l.id = sc.item_id
  WHERE l.status = 'active'
    AND l.owner_id != target_user_id
  ORDER BY sc.score DESC
  LIMIT num_recommendations;
END;
$$;


ALTER FUNCTION "public"."get_recommendations"("target_user_id" "uuid", "num_recommendations" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_unread_chats"("p_user_id" "uuid") RETURNS TABLE("chat_id" "uuid")
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  SELECT DISTINCT c.id AS chat_id
  FROM public.chats c
  INNER JOIN public.messages m
    ON m.chat_id = c.id
    AND m.sender_id != p_user_id
    AND m.created_at > coalesce(
      (SELECT rs.last_read_at FROM public.chat_read_status rs
       WHERE rs.chat_id = c.id AND rs.user_id = p_user_id),
      '1970-01-01'::timestamptz
    )
  WHERE c.buyer_id = p_user_id OR c.seller_id = p_user_id;
$$;


ALTER FUNCTION "public"."get_unread_chats"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_chat_read"("p_chat_id" "uuid") RETURNS "void"
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  insert into public.chat_read_status (chat_id, user_id, last_read_at)
  values (p_chat_id, auth.uid(), now())
  on conflict (chat_id, user_id) do update set last_read_at = now();
$$;


ALTER FUNCTION "public"."mark_chat_read"("p_chat_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_chat_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  update public.chats set updated_at = now() where id = new.chat_id;
  return new;
end;
$$;


ALTER FUNCTION "public"."update_chat_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."activity" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "listing_id" "uuid",
    "type" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "activity_type_check" CHECK (("type" = ANY (ARRAY['view'::"text", 'wishlist'::"text", 'purchase'::"text"])))
);


ALTER TABLE "public"."activity" OWNER TO "postgres";


ALTER TABLE "public"."activity" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."activity_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."chat_read_status" (
    "chat_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "last_read_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."chat_read_status" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "buyer_id" "uuid" NOT NULL,
    "seller_id" "uuid" NOT NULL,
    "listing_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "order_id" "uuid"
);


ALTER TABLE "public"."chats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "listing_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."genres" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "parent_id" "uuid"
);


ALTER TABLE "public"."genres" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."listing_genres" (
    "listing_id" "uuid" NOT NULL,
    "genre_id" "uuid" NOT NULL
);


ALTER TABLE "public"."listing_genres" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."listings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_id" "uuid",
    "title" "text" NOT NULL,
    "artist" "text" NOT NULL,
    "format" "text" NOT NULL,
    "genre" "text",
    "label" "text",
    "price" numeric NOT NULL,
    "condition" "text",
    "description" "text",
    "images" "text"[],
    "created_at" timestamp without time zone DEFAULT "now"(),
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "shipping_price" numeric DEFAULT 0 NOT NULL,
    "year" integer,
    CONSTRAINT "listings_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'hidden'::"text", 'sold'::"text"])))
);


ALTER TABLE "public"."listings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "chat_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "type" "text" DEFAULT 'text'::"text" NOT NULL,
    "metadata" "jsonb"
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "listing_id" "uuid",
    "buyer_id" "uuid",
    "shipping_address" "jsonb" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "stripe_payment_intent_id" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "avatar_url" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "about" "text",
    "location" "text",
    "shipping_address" "jsonb"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."activity"
    ADD CONSTRAINT "activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_read_status"
    ADD CONSTRAINT "chat_read_status_pkey" PRIMARY KEY ("chat_id", "user_id");



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_listing_id_key" UNIQUE ("user_id", "listing_id");



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."listing_genres"
    ADD CONSTRAINT "listing_genres_pkey" PRIMARY KEY ("listing_id", "genre_id");



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_stripe_payment_intent_id_key" UNIQUE ("stripe_payment_intent_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



CREATE UNIQUE INDEX "chats_buyer_seller_listing_key" ON "public"."chats" USING "btree" ("buyer_id", "seller_id", "listing_id");



CREATE INDEX "idx_chats_buyer_id" ON "public"."chats" USING "btree" ("buyer_id");



CREATE INDEX "idx_chats_seller_id" ON "public"."chats" USING "btree" ("seller_id");



CREATE INDEX "idx_chats_updated_at" ON "public"."chats" USING "btree" ("updated_at" DESC);



CREATE INDEX "idx_favorites_listing_id" ON "public"."favorites" USING "btree" ("listing_id");



CREATE INDEX "idx_favorites_user_id" ON "public"."favorites" USING "btree" ("user_id");



CREATE INDEX "idx_genres_display_order" ON "public"."genres" USING "btree" ("display_order");



CREATE INDEX "idx_genres_parent_id" ON "public"."genres" USING "btree" ("parent_id");



CREATE INDEX "idx_genres_slug" ON "public"."genres" USING "btree" ("slug");



CREATE INDEX "idx_listing_genres_genre_id" ON "public"."listing_genres" USING "btree" ("genre_id");



CREATE INDEX "idx_listing_genres_listing_id" ON "public"."listing_genres" USING "btree" ("listing_id");



CREATE INDEX "idx_listings_status" ON "public"."listings" USING "btree" ("status");



CREATE INDEX "idx_listings_status_created_at" ON "public"."listings" USING "btree" ("status", "created_at" DESC);



CREATE INDEX "idx_messages_chat_id" ON "public"."messages" USING "btree" ("chat_id");



CREATE OR REPLACE TRIGGER "messages_updated_at" AFTER INSERT ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."update_chat_updated_at"();



ALTER TABLE ONLY "public"."activity"
    ADD CONSTRAINT "activity_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."activity"
    ADD CONSTRAINT "activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_read_status"
    ADD CONSTRAINT "chat_read_status_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_read_status"
    ADD CONSTRAINT "chat_read_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."genres"
    ADD CONSTRAINT "genres_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."genres"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."listing_genres"
    ADD CONSTRAINT "listing_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."listing_genres"
    ADD CONSTRAINT "listing_genres_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow buyers and sellers to view orders" ON "public"."orders" FOR SELECT USING ((("buyer_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."listings"
  WHERE (("listings"."id" = "orders"."listing_id") AND ("listings"."owner_id" = "auth"."uid"()))))));



CREATE POLICY "Allow update if owner or confirmed buyer" ON "public"."listings" FOR UPDATE USING ((("owner_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."orders"
  WHERE (("orders"."listing_id" = "listings"."id") AND ("orders"."buyer_id" = "auth"."uid"()))))));



CREATE POLICY "Buyers and sellers can update orders" ON "public"."orders" FOR UPDATE USING ((("buyer_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."listings"
  WHERE (("listings"."id" = "orders"."listing_id") AND ("listings"."owner_id" = "auth"."uid"()))))));



CREATE POLICY "Genres are viewable by everyone" ON "public"."genres" FOR SELECT USING (true);



CREATE POLICY "Listing genres are viewable by everyone" ON "public"."listing_genres" FOR SELECT USING (true);



CREATE POLICY "Listings are public" ON "public"."listings" FOR SELECT USING (true);



CREATE POLICY "Public profile access" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "User logs own activity" ON "public"."activity" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create listings" ON "public"."listings" FOR INSERT WITH CHECK (("auth"."uid"() = "owner_id"));



CREATE POLICY "Users can create orders" ON "public"."orders" FOR INSERT WITH CHECK (("auth"."uid"() = "buyer_id"));



CREATE POLICY "Users can delete listing genres for their own listings" ON "public"."listing_genres" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."listings"
  WHERE (("listings"."id" = "listing_genres"."listing_id") AND ("listings"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can delete own listings" ON "public"."listings" FOR DELETE USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Users can delete their own favorites" ON "public"."favorites" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert chats as buyer" ON "public"."chats" FOR INSERT WITH CHECK (("auth"."uid"() = "buyer_id"));



CREATE POLICY "Users can insert listing genres for their own listings" ON "public"."listing_genres" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."listings"
  WHERE (("listings"."id" = "listing_genres"."listing_id") AND ("listings"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert messages in their chats" ON "public"."messages" FOR INSERT WITH CHECK ((("auth"."uid"() = "sender_id") AND (EXISTS ( SELECT 1
   FROM "public"."chats"
  WHERE (("chats"."id" = "messages"."chat_id") AND (("chats"."buyer_id" = "auth"."uid"()) OR ("chats"."seller_id" = "auth"."uid"())))))));



CREATE POLICY "Users can insert own read status" ON "public"."chat_read_status" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert their own favorites" ON "public"."favorites" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own read status" ON "public"."chat_read_status" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own chats" ON "public"."chats" FOR UPDATE USING ((("buyer_id" = "auth"."uid"()) OR ("seller_id" = "auth"."uid"())));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view messages in their chats" ON "public"."messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."chats"
  WHERE (("chats"."id" = "messages"."chat_id") AND (("chats"."buyer_id" = "auth"."uid"()) OR ("chats"."seller_id" = "auth"."uid"()))))));



CREATE POLICY "Users can view own read status" ON "public"."chat_read_status" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own chats" ON "public"."chats" FOR SELECT USING ((("buyer_id" = "auth"."uid"()) OR ("seller_id" = "auth"."uid"())));



CREATE POLICY "Users can view their own favorites" ON "public"."favorites" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users read only own activity" ON "public"."activity" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_read_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."genres" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."listing_genres" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."listings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."get_recommendations"("target_user_id" "uuid", "num_recommendations" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_recommendations"("target_user_id" "uuid", "num_recommendations" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recommendations"("target_user_id" "uuid", "num_recommendations" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_unread_chats"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_unread_chats"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_unread_chats"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_chat_read"("p_chat_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."mark_chat_read"("p_chat_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_chat_read"("p_chat_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_chat_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_chat_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_chat_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."activity" TO "anon";
GRANT ALL ON TABLE "public"."activity" TO "authenticated";
GRANT ALL ON TABLE "public"."activity" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activity_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activity_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activity_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."chat_read_status" TO "anon";
GRANT ALL ON TABLE "public"."chat_read_status" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_read_status" TO "service_role";



GRANT ALL ON TABLE "public"."chats" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";



GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";



GRANT ALL ON TABLE "public"."genres" TO "anon";
GRANT ALL ON TABLE "public"."genres" TO "authenticated";
GRANT ALL ON TABLE "public"."genres" TO "service_role";



GRANT ALL ON TABLE "public"."listing_genres" TO "anon";
GRANT ALL ON TABLE "public"."listing_genres" TO "authenticated";
GRANT ALL ON TABLE "public"."listing_genres" TO "service_role";



GRANT ALL ON TABLE "public"."listings" TO "anon";
GRANT ALL ON TABLE "public"."listings" TO "authenticated";
GRANT ALL ON TABLE "public"."listings" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


  create policy "Authenticated users can receive message broadcasts"
  on "realtime"."messages"
  as permissive
  for select
  to authenticated
using ((topic ~~ 'chat:%'::text));



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



