import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import styled from 'styled-components';

import { FieldError, FormGroup, HelpText, Input, Label, Select, TextArea } from '@/components/common/Form';
import { GenreSelector } from '@/components/common/GenreSelector';
import { type ListingFormData } from '@/hooks/useListingSubmit';
import {
  CONDITION_OPTIONS,
  CURRENCY_SYMBOL,
  FORMAT_OPTIONS,
  MAX_MAIN_GENRES,
  MAX_SUBGENRES,
} from '@/lib/constants/listings';

interface FormFieldsProps {
  register: UseFormRegister<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
  isSubmitting: boolean;
  selectedMainGenreIds: string[];
  selectedSubgenreIds: string[];
  onMainGenresChange: (genreIds: string[]) => void;
  onSubgenresChange: (genreIds: string[]) => void;
}

export function FormFields({
  register,
  errors,
  isSubmitting,
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
            <Label htmlFor="title">Title*</Label>
            <Input
              id="title"
              $hasError={!!errors.title}
              {...register('title', { required: 'Fill in the title' })}
              placeholder="Enter album/item title"
              type="text"
              disabled={isSubmitting}
              data-testid="listing-title-input"
            />
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="artist">Artist*</Label>
            <Input
              id="artist"
              $hasError={!!errors.artist}
              {...register('artist', { required: 'Fill in the artist name' })}
              placeholder="Enter artist name"
              type="text"
              disabled={isSubmitting}
              data-testid="listing-artist-input"
            />
            {errors.artist && <FieldError>{errors.artist.message}</FieldError>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="year">Year*</Label>
            <Input
              id="year"
              $hasError={!!errors.year}
              {...register('year', { required: 'Fill in the year' })}
              placeholder="e.g. 1996"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              disabled={isSubmitting}
              data-testid="listing-year-input"
            />
            {errors.year && <FieldError>{errors.year.message}</FieldError>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              {...register('label')}
              placeholder="Enter record label"
              type="text"
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
            <Label htmlFor="format">Format*</Label>
            <Select
              id="format"
              $hasError={!!errors.format}
              {...register('format', { required: 'Select the format' })}
              disabled={isSubmitting}
              data-testid="listing-format-select"
            >
              {FORMAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {errors.format && <FieldError>{errors.format.message}</FieldError>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="condition">Condition*</Label>
            <Select
              id="condition"
              $hasError={!!errors.condition}
              {...register('condition', { required: 'Select the condition' })}
              disabled={isSubmitting}
              data-testid="listing-condition-select"
            >
              {CONDITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {errors.condition && <FieldError>{errors.condition.message}</FieldError>}
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
          maxMainGenres={MAX_MAIN_GENRES}
          maxSubgenres={MAX_SUBGENRES}
        />
      </Section>

      <Section>
        <SectionHeader>Pricing</SectionHeader>
        <TwoColumnGrid>
          <FormGroup>
            <Label htmlFor="price">Price*</Label>
            <CurrencyInputWrapper>
              <InputPrefix data-testid="listing-price-prefix" aria-hidden="true">
                {CURRENCY_SYMBOL}
              </InputPrefix>
              <Input
                id="price"
                $hasError={!!errors.price}
                {...register('price', { required: 'Price should be greater than 0' })}
                min="0"
                placeholder="0.00"
                step="0.01"
                type="number"
                disabled={isSubmitting}
                data-testid="listing-price-input"
              />
            </CurrencyInputWrapper>
            {errors.price && <FieldError>{errors.price.message}</FieldError>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="shipping_price">Shipping Price</Label>
            <CurrencyInputWrapper>
              <InputPrefix data-testid="listing-shipping-prefix" aria-hidden="true">
                €
              </InputPrefix>
              <Input
                id="shipping_price"
                {...register('shipping_price')}
                min="0"
                placeholder="0.00"
                step="0.01"
                type="number"
                disabled={isSubmitting}
                data-testid="listing-shipping-input"
              />
            </CurrencyInputWrapper>
            <HelpText>Leave empty for free shipping</HelpText>
          </FormGroup>
        </TwoColumnGrid>
      </Section>

      <Section>
        <SectionHeader>Description</SectionHeader>
        <FormGroup>
          <TextArea
            id="description"
            {...register('description')}
            placeholder="Add any additional details about the item..."
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
    gap: 1.75rem;
  }
`;

const CurrencyInputWrapper = styled.div`
  position: relative;
  input {
    padding-left: 2rem;
    width: 100%;
  }
`;

const InputPrefix = styled.span`
  position: absolute;
  left: 1rem;
  bottom: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
  pointer-events: none;
`;
