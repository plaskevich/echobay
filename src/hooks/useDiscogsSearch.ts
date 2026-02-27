import { useCallback, useEffect, useRef, useState } from 'react';

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

const SEARCH_TIMEOUT_MS = 15_000;

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
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchQueryRef = useRef(searchQuery);
  searchQueryRef.current = searchQuery;

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const performSearch = useCallback(async () => {
    const query = searchQueryRef.current;
    if (!query.trim()) {
      setSearchError('Please enter a search query');
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchDiscogs(query, controller.signal);

      if (controller.signal.aborted) return;

      setSearchResults(results);

      if (results.length === 0) {
        setSearchError('No results found. Try a different search term.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to search Discogs. Please try again.';
      setSearchError(errorMessage);
      console.error('Search error:', error);
    } finally {
      clearTimeout(timeout);
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  }, []);

  const selectRelease = useCallback(async (releaseId: number): Promise<DiscogsRelease | null> => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

    setIsSearching(true);
    setSearchError(null);

    try {
      const release = await getDiscogsRelease(releaseId, controller.signal);
      return release;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return null;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch release details. Please try again.';
      setSearchError(errorMessage);
      console.error('Release fetch error:', error);
      return null;
    } finally {
      clearTimeout(timeout);
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  }, []);

  const clearSearch = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
  }, []);

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
