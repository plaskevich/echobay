import { supabase } from '@/lib/supabase';

const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1';

export interface DiscogsSearchResult {
  id: number;
  title: string;
  artist?: string;
  year?: string;
  label?: string[];
  genre?: string[];
  cover_image?: string;
  thumb?: string;
}

export interface DiscogsRelease {
  id: number;
  title: string;
  artists?: Array<{ name: string }>;
  year?: number;
  genres?: string[];
  styles?: string[];
  images?: Array<{ uri: string; type: string }>;
  tracklist?: Array<{ title: string; position: string }>;
}

interface DiscogsSearchResponse {
  results: DiscogsSearchResult[];
  pagination: {
    page: number;
    pages: number;
    items: number;
  };
}

async function callDiscogsProxy(body: Record<string, unknown>, signal?: AbortSignal) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/discogs-proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.error || `Discogs API error: ${response.status} ${response.statusText}`;

    if (response.status === 401) {
      throw new Error('Authentication failed. Please check your Discogs API credentials.');
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    throw new Error(message);
  }

  return response.json();
}

export function isDiscogsConfigured(): boolean {
  return true;
}

export function getSetupMessage(): string {
  return 'Discogs API credentials not configured on the server. Set DISCOGS_KEY and DISCOGS_SECRET as Supabase secrets.';
}

export async function searchDiscogs(query: string, signal?: AbortSignal): Promise<DiscogsSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const data: DiscogsSearchResponse = await callDiscogsProxy({ action: 'search', query }, signal);
    return data.results || [];
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    console.error('Error searching Discogs:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to Discogs. Please check your internet connection.');
  }
}

export async function getDiscogsRelease(releaseId: number, signal?: AbortSignal): Promise<DiscogsRelease> {
  try {
    const data: DiscogsRelease = await callDiscogsProxy({ action: 'release', releaseId }, signal);
    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    console.error('Error fetching Discogs release:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch release details from Discogs.');
  }
}

export function extractArtistName(artists?: Array<{ name: string }>): string {
  if (!artists || artists.length === 0) return '';
  return artists[0].name;
}

export function extractGenre(genres?: string[], styles?: string[]): string {
  const allGenres: string[] = [];

  if (genres && genres.length > 0) {
    allGenres.push(...genres);
  }

  if (styles && styles.length > 0) {
    allGenres.push(...styles);
  }

  return allGenres.join(', ');
}
