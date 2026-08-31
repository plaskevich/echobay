import { supabase } from '@/lib/supabase';

export interface Genre {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  parent_id: string | null;
}

export type GenreRef = Pick<Genre, 'id' | 'name' | 'slug'>;

export async function fetchGenres() {
  return await supabase.from('genres').select('*').order('display_order', { ascending: true });
}

export async function fetchMainGenres() {
  return await supabase.from('genres').select('*').is('parent_id', null).order('display_order', { ascending: true });
}

export async function fetchSubgenres() {
  return await supabase
    .from('genres')
    .select('*')
    .not('parent_id', 'is', null)
    .order('display_order', { ascending: true });
}

interface ListingGenreRow {
  genre_id: string;
  genres: Genre | null;
}

export async function fetchListingGenres(
  listingId: string
): Promise<{ data: ListingGenreRow[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('listing_genres')
    .select('genre_id, genres(*)')
    .eq('listing_id', listingId);

  return { data: data as ListingGenreRow[] | null, error };
}

export async function setListingGenres(listingId: string, genreIds: string[]) {
  const { error: deleteError } = await supabase.from('listing_genres').delete().eq('listing_id', listingId);

  if (deleteError) return { error: deleteError };
  if (genreIds.length === 0) return { error: null };
  const insertData = genreIds.map((genreId) => ({
    listing_id: listingId,
    genre_id: genreId,
  }));

  return await supabase.from('listing_genres').insert(insertData);
}
