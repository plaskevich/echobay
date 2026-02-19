import { City, Country, State } from 'country-state-city';
import { useMemo, useState } from 'react';

const COUNTRIES_WITH_STATES = new Set(['US', 'CA', 'AU', 'BR', 'IN', 'MX', 'CN', 'MY', 'NG', 'AE']);

export function useLocationAutocomplete() {
  const [query, setQuery] = useState('');

  const allCities = useMemo(() => {
    const cities = City.getAllCities();
    return cities.map((city) => {
      const country = Country.getCountryByCode(city.countryCode);
      const state = city.stateCode ? State.getStateByCodeAndCountry(city.stateCode, city.countryCode) : null;
      const includeState = state?.name && COUNTRIES_WITH_STATES.has(city.countryCode);

      return {
        name: city.name,
        country: country?.name || city.countryCode,
        state: includeState ? state.name : undefined,
        displayName: includeState
          ? `${city.name}, ${state.name}, ${country?.name || city.countryCode}`
          : `${city.name}, ${country?.name || city.countryCode}`,
      };
    });
  }, []);

  const suggestions = useMemo(() => {
    if (query.length < 2) {
      return [];
    }

    const searchQuery = query.toLowerCase();
    return allCities
      .filter((city) => {
        return city.name.toLowerCase().startsWith(searchQuery);
      })
      .slice(0, 5);
  }, [query, allCities]);

  return {
    query,
    setQuery,
    suggestions,
  };
}
