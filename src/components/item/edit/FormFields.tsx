import { type FieldErrors, type UseFormRegister, type UseFormRegisterReturn } from 'react-hook-form';
import styled from 'styled-components';

import {
  FieldError,
  FormGroup,
  HelpText,
  Input,
  Label,
  Select,
  TextArea,
  TwoColumnGrid,
} from '@/components/common/Form';
import { GenreSelector } from '@/components/common/GenreSelector';
import { type ListingFormData } from '@/hooks/useListingSubmit';
import {
  CONDITION_OPTIONS,
  CURRENCY_SYMBOL,
  FORMAT_OPTIONS,
  MAX_MAIN_GENRES,
  MAX_SUBGENRES,
} from '@/lib/constants/listings';

const MONEY_RULE = {
  validate: (value: string) => !value || /^\d+([.,]\d{1,2})?$/.test(value) || 'Enter an amount like 13.00',
};

const withCents = (field: UseFormRegisterReturn) => ({
  ...field,
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
    const amount = Number(e.target.value.replace(',', '.'));
    if (e.target.value && !Number.isNaN(amount)) e.target.value = amount.toFixed(2);
    return field.onBlur(e);
  },
});

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
      <TwoColumnGrid>
        <FormGroup>
          <Label htmlFor="title" $required>
            Title
          </Label>
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
          <Label htmlFor="artist" $required>
            Artist
          </Label>
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
          <Label htmlFor="year" $required>
            Year
          </Label>
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

      <TwoColumnGrid>
        <FormGroup>
          <Label htmlFor="format" $required>
            Format
          </Label>
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
          <Label htmlFor="condition" $required>
            Condition
          </Label>
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

      <GenreSelector
        selectedMainGenreIds={selectedMainGenreIds}
        selectedSubgenreIds={selectedSubgenreIds}
        onMainGenresChange={onMainGenresChange}
        onSubgenresChange={onSubgenresChange}
        disabled={isSubmitting}
        maxMainGenres={MAX_MAIN_GENRES}
        maxSubgenres={MAX_SUBGENRES}
      />
      <TwoColumnGrid>
        <FormGroup>
          <Label htmlFor="price" $required>
            Price
          </Label>
          <CurrencyInputWrapper>
            <InputPrefix data-testid="listing-price-prefix" aria-hidden="true">
              {CURRENCY_SYMBOL}
            </InputPrefix>
            <StyledInput
              id="price"
              $hasError={!!errors.price}
              {...withCents(register('price', { required: 'Price should be greater than 0', ...MONEY_RULE }))}
              placeholder="0.00"
              type="text"
              inputMode="decimal"
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
            <StyledInput
              id="shipping_price"
              $hasError={!!errors.shipping_price}
              {...withCents(register('shipping_price', MONEY_RULE))}
              placeholder="0.00"
              type="text"
              inputMode="decimal"
              disabled={isSubmitting}
              data-testid="listing-shipping-input"
            />
          </CurrencyInputWrapper>
          {errors.shipping_price ? (
            <FieldError>{errors.shipping_price.message}</FieldError>
          ) : (
            <HelpText>Leave empty for free shipping</HelpText>
          )}
        </FormGroup>
      </TwoColumnGrid>

      <FormGroup>
        <TextArea
          id="description"
          {...register('description')}
          placeholder="Add any additional details about the item..."
          disabled={isSubmitting}
          data-testid="listing-description-input"
        />
      </FormGroup>
    </SectionsWrapper>
  );
}

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CurrencyInputWrapper = styled.div`
  position: relative;
  input {
    padding-left: 1.75rem;
    width: 100%;
  }
`;

const InputPrefix = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text.primary};
  pointer-events: none;
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-weight: 500;
`;

const StyledInput = styled(Input)`
  font-family: ${({ theme }) => theme.fontFamilyAlt};
  font-weight: 500;
`;
