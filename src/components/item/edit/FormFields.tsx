import { type ChangeEvent } from 'react';
import styled from 'styled-components';

import { FormGroup, Input, Label, OptionalLabel, Select, TextArea } from '@/components/common/Form';
import { GenreSelector } from '@/components/common/GenreSelector';
import { type ListingFormData } from '@/hooks/useListingSubmit';
import { CONDITION_OPTIONS, FORMAT_OPTIONS } from '@/lib/constants/listings';

interface FormFieldsProps {
  formData: ListingFormData;
  isSubmitting: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  selectedMainGenreIds: string[];
  selectedSubgenreIds: string[];
  onMainGenresChange: (genreIds: string[]) => void;
  onSubgenresChange: (genreIds: string[]) => void;
}

export function FormFields({
  formData,
  isSubmitting,
  onChange,
  selectedMainGenreIds,
  selectedSubgenreIds,
  onMainGenresChange,
  onSubgenresChange,
}: FormFieldsProps) {
  return (
    <SectionsWrapper>
      <Section>
        <SectionHeader>Item Details</SectionHeader>
        <TwoColumnGrid>
          <FormGroup>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              onChange={onChange}
              placeholder="Enter album/item title"
              required
              type="text"
              value={formData.title}
              disabled={isSubmitting}
              data-testid="listing-title-input"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="artist">Artist *</Label>
            <Input
              id="artist"
              name="artist"
              onChange={onChange}
              placeholder="Enter artist name"
              required
              type="text"
              value={formData.artist}
              disabled={isSubmitting}
              data-testid="listing-artist-input"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="year">
              Year <OptionalLabel>(optional)</OptionalLabel>
            </Label>
            <Input
              id="year"
              name="year"
              onChange={onChange}
              placeholder="e.g. 1999"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.year}
              disabled={isSubmitting}
              data-testid="listing-year-input"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="label">
              Label <OptionalLabel>(optional)</OptionalLabel>
            </Label>
            <Input
              id="label"
              name="label"
              onChange={onChange}
              placeholder="Enter record label"
              type="text"
              value={formData.label}
              disabled={isSubmitting}
              data-testid="listing-label-input"
            />
          </FormGroup>
        </TwoColumnGrid>
      </Section>

      <Section>
        <SectionHeader>Format & Condition</SectionHeader>
        <TwoColumnGrid>
          <FormGroup>
            <Label htmlFor="format">Format *</Label>
            <Select
              id="format"
              name="format"
              onChange={onChange}
              required
              value={formData.format}
              disabled={isSubmitting}
              data-testid="listing-format-select"
            >
              {FORMAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="condition">Condition *</Label>
            <Select
              id="condition"
              name="condition"
              onChange={onChange}
              value={formData.condition}
              disabled={isSubmitting}
              data-testid="listing-condition-select"
            >
              {CONDITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormGroup>
        </TwoColumnGrid>
      </Section>

      <Section>
        <SectionHeader>Genres</SectionHeader>
        <GenreSelector
          selectedMainGenreIds={selectedMainGenreIds}
          selectedSubgenreIds={selectedSubgenreIds}
          onMainGenresChange={onMainGenresChange}
          onSubgenresChange={onSubgenresChange}
          disabled={isSubmitting}
          maxMainGenres={3}
          maxSubgenres={5}
        />
      </Section>

      <Section>
        <SectionHeader>Pricing</SectionHeader>
        <TwoColumnGrid>
          <FormGroup>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              min="0"
              name="price"
              onChange={onChange}
              placeholder="0.00"
              required
              step="0.01"
              type="number"
              value={formData.price}
              disabled={isSubmitting}
              data-testid="listing-price-input"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="shipping_price">Shipping Price *</Label>
            <Input
              id="shipping_price"
              min="0"
              name="shipping_price"
              onChange={onChange}
              placeholder="0.00"
              required
              step="0.01"
              type="number"
              value={formData.shipping_price}
              disabled={isSubmitting}
              data-testid="listing-shipping-input"
            />
          </FormGroup>
        </TwoColumnGrid>
      </Section>

      <Section>
        <SectionHeader>Description</SectionHeader>
        <FormGroup>
          <TextArea
            id="description"
            name="description"
            onChange={onChange}
            placeholder="Add any additional details about the item..."
            value={formData.description}
            disabled={isSubmitting}
            data-testid="listing-description-input"
          />
        </FormGroup>
      </Section>
    </SectionsWrapper>
  );
}

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.25rem 1.5rem 1.5rem;
  background-color: ${({ theme }) => theme.background.secondary};

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const SectionHeader = styled.legend`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.text.secondary};
  padding: 0 0.5rem;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;
