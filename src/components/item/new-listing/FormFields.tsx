import { type ChangeEvent } from 'react';
import styled from 'styled-components';

import { FormGroup, Input, Label, OptionalLabel, Select, TextArea } from '@/components/common/Form';
import { type ListingFormData } from '@/hooks/useListingSubmit';
import { CONDITION_OPTIONS, FORMAT_OPTIONS } from '@/lib/constants/listings';

interface FormFieldsProps {
  formData: ListingFormData;
  isSubmitting: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function FormFields({ formData, isSubmitting, onChange }: FormFieldsProps) {
  return (
    <>
      <FieldsGrid>
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
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="format">Format *</Label>
          <Select
            id="format"
            name="format"
            onChange={onChange}
            required
            value={formData.format}
            disabled={isSubmitting}
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
          >
            {CONDITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="genre">
            Genre <OptionalLabel>(optional)</OptionalLabel>
          </Label>
          <Input
            id="genre"
            name="genre"
            onChange={onChange}
            placeholder="e.g., Rock, Jazz, Electronic"
            type="text"
            value={formData.genre}
            disabled={isSubmitting}
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
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="price">Price*</Label>
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
          />
        </FormGroup>
      </FieldsGrid>

      <FormGroup>
        <Label htmlFor="description">
          Description <OptionalLabel>(optional)</OptionalLabel>
        </Label>
        <TextArea
          id="description"
          name="description"
          onChange={onChange}
          placeholder="Add any additional details about the item..."
          value={formData.description}
          disabled={isSubmitting}
        />
      </FormGroup>
    </>
  );
}

const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;
