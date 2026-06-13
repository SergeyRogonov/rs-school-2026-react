import { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return countries
      .map((country) => ({
        country,
        population: getPopulationForYear(createYearDataMap(country.data), selectedYear) || 0,
      }))
      .filter(({ country }) => {
        const matchesSearch =
          !normalizedQuery || country.id.toLowerCase().includes(normalizedQuery);
        const matchesRegion =
          !selectedRegion || country.data.some((d) => d.region === selectedRegion);
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc'
            ? a.country.id.localeCompare(b.country.id)
            : b.country.id.localeCompare(a.country.id);
        }
        return sortOrder === 'asc' ? a.population - b.population : b.population - a.population;
      })
      .map(({ country }) => country);
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  return (
    <Virtuoso
      useWindowScroll
      style={styles}
      data={filteredCountries}
      itemContent={(_, country) => (
        <CountryCard
          country={country}
          selectedYear={selectedYear}
          selectedColumns={selectedColumns}
        />
      )}
    />
  );
};
