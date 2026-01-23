import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { FormGroup, Input, Label } from '@/components/common/Form';
import { useLocationAutocomplete } from '@/hooks/useLocationAutocomplete';

interface LocationAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

export function LocationAutocomplete({
  id = 'location',
  value,
  onChange,
  placeholder = 'City, Country',
  disabled,
  label = 'Location',
}: LocationAutocompleteProps) {
  const { query, setQuery, suggestions } = useLocationAutocomplete();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSuggestions) {
      setQuery(value);
    }
  }, [value, showSuggestions, setQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setQuery(value);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setQuery, value]);

  const handleInputChange = (newValue: string) => {
    setQuery(newValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (displayName: string) => {
    onChange(displayName);
    setQuery(displayName);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex].displayName);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <FormGroup>
      {label && <Label htmlFor={id}>{label}</Label>}
      <AutocompleteWrapper ref={wrapperRef}>
        <Input
          id={id}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />

        {showSuggestions && suggestions.length > 0 && (
          <SuggestionsList>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={`${suggestion.displayName}-${index}`}
                onClick={() => handleSuggestionClick(suggestion.displayName)}
                $isSelected={index === selectedIndex}
              >
                <LocationName>{suggestion.name}</LocationName>
                <LocationCountry>
                  {suggestion.state ? `${suggestion.state}, ` : ''}
                  {suggestion.country}
                </LocationCountry>
              </SuggestionItem>
            ))}
          </SuggestionsList>
        )}
      </AutocompleteWrapper>
    </FormGroup>
  );
}

const AutocompleteWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  padding: 0;
  list-style: none;
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
`;

const SuggestionItem = styled.li<{ $isSelected: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background: ${({ theme, $isSelected }) => ($isSelected ? theme.background.tertiary : 'transparent')};
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background.tertiary};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border.primary};
  }
`;

const LocationName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 2px;
`;

const LocationCountry = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;
