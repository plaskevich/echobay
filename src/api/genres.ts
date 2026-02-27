import { supabase } from '@/lib/supabase';

export interface Genre {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  parent_id: string | null;
}

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

export async function fetchSubgenresByParentIds(parentIds: string[]) {
  if (parentIds.length === 0) return { data: [], error: null };

  return await supabase
    .from('genres')
    .select('*')
    .in('parent_id', parentIds)
    .order('display_order', { ascending: true });
}

export async function fetchGenresByIds(ids: string[]) {
  if (ids.length === 0) return { data: [], error: null };

  return await supabase.from('genres').select('*').in('id', ids).order('display_order', { ascending: true });
}

export async function fetchGenresByNames(names: string[]) {
  if (names.length === 0) return { data: [], error: null };
  const normalizedNames = names.map((n) => n.toLowerCase().trim());

  const { data, error } = await supabase.from('genres').select('*').order('display_order', { ascending: true });

  if (error) return { data: null, error };
  const matchedGenres = data?.filter((genre) => normalizedNames.includes(genre.name.toLowerCase())) || [];

  return { data: matchedGenres, error: null };
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
