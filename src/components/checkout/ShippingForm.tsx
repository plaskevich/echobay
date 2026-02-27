import { Country, State } from 'country-state-city';
import { useForm, useWatch } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { FieldError, Form, Input, Label, Select } from '@/components/common/Form';

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface ShippingFormProps {
  onSubmit: (address: ShippingAddress) => void;
  initialData?: ShippingAddress;
  submitLabel?: string;
  isLoading?: boolean;
  title?: string;
}

export function ShippingForm({
  onSubmit,
  initialData,
  submitLabel = 'Continue to Payment',
  isLoading,
  title = 'Shipping Address',
}: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<ShippingAddress>({
    defaultValues: initialData || {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
    },
  });

  const country = useWatch({ control, name: 'country' });
  const countries = Country.getAllCountries();
  const states = country ? State.getStatesOfCountry(country) : [];

  return (
    <Form onSubmit={handleSubmit(onSubmit)} data-testid="shipping-form">
      {title && <FormTitle data-testid="shipping-form-title">{title}</FormTitle>}

      <FormField>
        <Label>Full Name*</Label>
        <Input
          type="text"
          $hasError={!!errors.fullName}
          {...register('fullName', {
            validate: (v) => v.trim() !== '' || 'Full name is required',
          })}
          placeholder="John Doe"
          data-testid="shipping-fullname-input"
        />
        {errors.fullName && <FieldError data-testid="shipping-error-fullname">{errors.fullName.message}</FieldError>}
      </FormField>

      <FormField>
        <Label>Address Line 1*</Label>
        <Input
          type="text"
          $hasError={!!errors.addressLine1}
          {...register('addressLine1', {
            validate: (v) => v.trim() !== '' || 'Address is required',
          })}
          placeholder="Street address, P.O. box"
          data-testid="shipping-address1-input"
        />
        {errors.addressLine1 && (
          <FieldError data-testid="shipping-error-address1">{errors.addressLine1.message}</FieldError>
        )}
      </FormField>

      <FormField>
        <Label>Address Line 2</Label>
        <Input
          type="text"
          {...register('addressLine2')}
          placeholder="Apartment, suite, unit, building, floor, etc."
          data-testid="shipping-address2-input"
        />
      </FormField>

      <FormRow>
        <FormField>
          <Label>City*</Label>
          <Input
            type="text"
            $hasError={!!errors.city}
            {...register('city', {
              validate: (v) => v.trim() !== '' || 'City is required',
            })}
            placeholder="City"
            data-testid="shipping-city-input"
          />
          {errors.city && <FieldError data-testid="shipping-error-city">{errors.city.message}</FieldError>}
        </FormField>

        <FormField>
          <Label>Postal Code*</Label>
          <Input
            type="text"
            $hasError={!!errors.postalCode}
            {...register('postalCode', {
              validate: (v) => v.trim() !== '' || 'Postal code is required',
            })}
            placeholder="12345"
            data-testid="shipping-postalcode-input"
          />
          {errors.postalCode && (
            <FieldError data-testid="shipping-error-postalcode">{errors.postalCode.message}</FieldError>
          )}
        </FormField>
      </FormRow>

      <FormRow>
        <FormField>
          <Label>Country*</Label>
          <Select
            $hasError={!!errors.country}
            {...register('country', {
              required: 'Country is required',
              onChange: () => setValue('state', ''),
            })}
            data-testid="shipping-country-select"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </Select>
          {errors.country && <FieldError data-testid="shipping-error-country">{errors.country.message}</FieldError>}
        </FormField>

        <FormField>
          <Label>State / Province</Label>
          <Select {...register('state')} disabled={!country || states.length === 0} data-testid="shipping-state-select">
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </Select>
        </FormField>
      </FormRow>

      <FormField>
        <Label>Phone Number*</Label>
        <Input
          type="tel"
          $hasError={!!errors.phone}
          {...register('phone', {
            validate: (v) => v.trim() !== '' || 'Phone number is required',
          })}
          placeholder="+49 151 12345678"
          data-testid="shipping-phone-input"
        />
        {errors.phone && <FieldError data-testid="shipping-error-phone">{errors.phone.message}</FieldError>}
      </FormField>

      <ButtonContainer>
        <Button type="submit" variant="primary" isLoading={isLoading} data-testid="shipping-submit-button">
          {submitLabel}
        </Button>
      </ButtonContainer>
    </Form>
  );
}

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

const FormField = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;

  @media (max-width: 768px) {
    > button {
      width: 100%;
    }
  }
`;
