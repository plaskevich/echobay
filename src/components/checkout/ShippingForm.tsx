import { Country, State } from 'country-state-city';
import { useState } from 'react';
import styled from 'styled-components';

import { Button } from '@/components/common/Button';
import { Form, Input, Label, Select } from '@/components/common/Form';

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
  onNext: (address: ShippingAddress) => void;
  initialData?: ShippingAddress;
}

export function ShippingForm({ onNext, initialData }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingAddress>(
    initialData || {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormTitle>Shipping Address</FormTitle>
      <FormField>
        <Label>Full Name *</Label>
        <Input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Doe"
        />
        {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
      </FormField>

      <FormField>
        <Label>Address Line 1 *</Label>
        <Input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => handleChange('addressLine1', e.target.value)}
          placeholder="Street address, P.O. box"
        />
        {errors.addressLine1 && <ErrorText>{errors.addressLine1}</ErrorText>}
      </FormField>

      <FormField>
        <Label>Address Line 2</Label>
        <Input
          type="text"
          value={formData.addressLine2}
          onChange={(e) => handleChange('addressLine2', e.target.value)}
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
      </FormField>

      <FormRow>
        <FormField>
          <Label>City *</Label>
          <Input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
          />
          {errors.city && <ErrorText>{errors.city}</ErrorText>}
        </FormField>

        <FormField>
          <Label>Postal Code *</Label>
          <Input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            placeholder="12345"
          />
          {errors.postalCode && <ErrorText>{errors.postalCode}</ErrorText>}
        </FormField>
      </FormRow>

      <FormRow>
        <FormField>
          <Label>Country *</Label>
          <Select
            value={formData.country}
            onChange={(e) => {
              handleChange('country', e.target.value);
              handleChange('state', '');
            }}
            // error={!!errors.country}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </Select>
          {errors.country && <ErrorText>{errors.country}</ErrorText>}
        </FormField>

        <FormField>
          <Label>State / Province</Label>
          <Select
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            disabled={!formData.country || states.length === 0}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </Select>
        </FormField>
      </FormRow>

      <FormField>
        <Label>Phone Number *</Label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
      </FormField>

      <ButtonContainer>
        <Button type="submit" variant="primary" size="large" fullWidth>
          Continue to Payment
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
`;

const FormField = styled.div`
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

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.state.error};
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
`;
