const DISCOGS_API_BASE = 'https://api.discogs.com';
const USER_AGENT = 'EchoBay/1.0 +https://github.com/plaskevich/EchoBay';

const DISCOGS_KEY = import.meta.env.VITE_DISCOGS_KEY || '';
const DISCOGS_SECRET = import.meta.env.VITE_DISCOGS_SECRET || '';

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

function getAuthParams(): Record<string, string> {
  if (DISCOGS_KEY && DISCOGS_SECRET) {
    return { key: DISCOGS_KEY, secret: DISCOGS_SECRET };
  }
  return {};
}

export function isDiscogsConfigured(): boolean {
  return !!(DISCOGS_KEY && DISCOGS_SECRET);
}

export function getSetupMessage(): string {
  return 'Discogs API credentials not found. Add VITE_DISCOGS_KEY and VITE_DISCOGS_SECRET to your .env file. See DISCOGS_SETUP.md for instructions.';
}

export async function searchDiscogs(query: string): Promise<DiscogsSearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  if (!isDiscogsConfigured()) {
    throw new Error(getSetupMessage());
  }

  try {
    const params = new URLSearchParams({
      q: query,
      type: 'master',
      per_page: '10',
      ...getAuthParams(),
    });

    const response = await fetch(`${DISCOGS_API_BASE}/database/search?${params}`, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your Discogs API credentials.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else {
        throw new Error(`Discogs API error: ${response.status} ${response.statusText}`);
      }
    }

    const data: DiscogsSearchResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching Discogs:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to connect to Discogs. Please check your internet connection.');
  }
}

export async function getDiscogsRelease(releaseId: number): Promise<DiscogsRelease> {
  try {
    const params = new URLSearchParams(getAuthParams());
    const url = `${DISCOGS_API_BASE}/masters/${releaseId}${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please check your Discogs API credentials.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else {
        throw new Error(`Discogs API error: ${response.status} ${response.statusText}`);
      }
    }

    const data: DiscogsRelease = await response.json();
    return data;
  } catch (error) {
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
