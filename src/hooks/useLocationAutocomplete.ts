import { useEffect, useMemo, useState } from 'react';

const COUNTRIES_WITH_STATES = new Set(['US', 'CA', 'AU', 'BR', 'IN', 'MX', 'CN', 'MY', 'NG', 'AE']);
const MIN_QUERY_LENGTH = 2;
const MAX_SUGGESTIONS = 5;

type LocationData = typeof import('country-state-city');

interface LocationSuggestion {
  name: string;
  country: string;
  state?: string;
  displayName: string;
}

export function useLocationAutocomplete() {
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState<LocationData | null>(null);

  const isSearchable = query.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!isSearchable || locations) {
      return;
    }

    let cancelled = false;

    import('country-state-city').then((module) => {
      if (!cancelled) {
        setLocations(module);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isSearchable, locations]);

  const suggestions = useMemo<LocationSuggestion[]>(() => {
    if (!isSearchable || !locations) {
      return [];
    }

    const { City, Country, State } = locations;
    const searchQuery = query.toLowerCase();
    const matches: LocationSuggestion[] = [];

    // Build display names only for the handful we show, not all 148k cities.
    for (const city of City.getAllCities()) {
      if (!city.name.toLowerCase().startsWith(searchQuery)) {
        continue;
      }

      const country = Country.getCountryByCode(city.countryCode);
      const countryName = country?.name || city.countryCode;
      const state = city.stateCode ? State.getStateByCodeAndCountry(city.stateCode, city.countryCode) : null;
      const stateName = state?.name && COUNTRIES_WITH_STATES.has(city.countryCode) ? state.name : undefined;

      matches.push({
        name: city.name,
        country: countryName,
        state: stateName,
        displayName: stateName ? `${city.name}, ${stateName}, ${countryName}` : `${city.name}, ${countryName}`,
      });

      if (matches.length === MAX_SUGGESTIONS) {
        break;
      }
    }

    return matches;
  }, [query, isSearchable, locations]);

  return {
    query,
    setQuery,
    suggestions,
  };
}
