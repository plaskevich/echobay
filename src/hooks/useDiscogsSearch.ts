import { useState } from 'react';

import {
  type DiscogsRelease,
  type DiscogsSearchResult,
  extractArtistName,
  extractGenre,
  getDiscogsRelease,
  getSetupMessage,
  isDiscogsConfigured,
  searchDiscogs,
} from '@/lib/discogs';

interface UseDiscogsSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: DiscogsSearchResult[];
  isSearching: boolean;
  searchError: string | null;
  performSearch: () => Promise<void>;
  selectRelease: (releaseId: number) => Promise<DiscogsRelease | null>;
  clearSearch: () => void;
}

export function useDiscogsSearch(): UseDiscogsSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DiscogsSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a search query');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchDiscogs(searchQuery);
      setSearchResults(results);

      if (results.length === 0) {
        setSearchError('No results found. Try a different search term.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search Discogs. Please try again.';
      setSearchError(errorMessage);
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectRelease = async (releaseId: number): Promise<DiscogsRelease | null> => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const release = await getDiscogsRelease(releaseId);
      return release;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch release details. Please try again.';
      setSearchError(errorMessage);
      console.error('Release fetch error:', error);
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    performSearch,
    selectRelease,
    clearSearch,
  };
}

export type { DiscogsRelease, DiscogsSearchResult };
export { extractArtistName, extractGenre, isDiscogsConfigured, getSetupMessage };
