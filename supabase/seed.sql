-- Seed data for E2E tests

-- Create the listings storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- Seed genres (no user dependency)
INSERT INTO public.genres (id, name, slug, display_order, parent_id) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Rock', 'rock', 1, NULL),
  ('a0000000-0000-0000-0000-000000000002', 'Jazz', 'jazz', 2, NULL),
  ('a0000000-0000-0000-0000-000000000003', 'Electronic', 'electronic', 3, NULL),
  ('a0000000-0000-0000-0000-000000000004', 'Hip Hop', 'hip-hop', 4, NULL),
  ('a0000000-0000-0000-0000-000000000005', 'Classical', 'classical', 5, NULL),
  ('a0000000-0000-0000-0000-000000000006', 'Pop', 'pop', 6, NULL),
  ('a0000000-0000-0000-0000-000000000007', 'Blues', 'blues', 7, NULL),
  ('a0000000-0000-0000-0000-000000000008', 'Country', 'country', 8, NULL),
  ('a0000000-0000-0000-0000-000000000009', 'R&B', 'r-and-b', 9, NULL),
  ('a0000000-0000-0000-0000-000000000010', 'Folk', 'folk', 10, NULL),
  -- Sub-genres
  ('b0000000-0000-0000-0000-000000000001', 'Alternative Rock', 'alternative-rock', 1, 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000002', 'Punk Rock', 'punk-rock', 2, 'a0000000-0000-0000-0000-000000000001'),
  ('b0000000-0000-0000-0000-000000000003', 'Bebop', 'bebop', 1, 'a0000000-0000-0000-0000-000000000002'),
  ('b0000000-0000-0000-0000-000000000004', 'House', 'house', 1, 'a0000000-0000-0000-0000-000000000003'),
  ('b0000000-0000-0000-0000-000000000005', 'Techno', 'techno', 2, 'a0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;
