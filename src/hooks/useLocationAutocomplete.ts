import { City, Country, State } from 'country-state-city';
import { useMemo, useState } from 'react';

export function useLocationAutocomplete() {
  const [query, setQuery] = useState('');

  const allCities = useMemo(() => {
    const cities = City.getAllCities();
    return cities.map((city) => {
      const country = Country.getCountryByCode(city.countryCode);
      const state = city.stateCode ? State.getStateByCodeAndCountry(city.stateCode, city.countryCode) : null;

      return {
        name: city.name,
        country: country?.name || city.countryCode,
        state: state?.name,
        displayName: state?.name
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
