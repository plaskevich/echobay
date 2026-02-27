import { type Control, Controller, type UseFormRegister } from 'react-hook-form';

import { FormGroup, Input, Label, TextArea } from '@/components/common/Form';
import { LocationAutocomplete } from '@/components/common/LocationAutocomplete';
import { type ProfileFormData } from '@/hooks/useProfileEdit';

interface ProfileFormFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  control: Control<ProfileFormData>;
  disabled?: boolean;
}

export function ProfileFormFields({ register, control, disabled }: ProfileFormFieldsProps) {
  return (
    <>
      <FormGroup>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          {...register('username')}
          placeholder="Enter your username"
          disabled={disabled}
          data-testid="username-input"
        />
      </FormGroup>

      <FormGroup>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <LocationAutocomplete
              id="location"
              value={field.value}
              onChange={field.onChange}
              placeholder="City, Country"
              disabled={disabled}
              label="Location"
            />
          )}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="about">About You</Label>
        <TextArea
          id="about"
          {...register('about')}
          placeholder="Tell us about yourself..."
          disabled={disabled}
          rows={6}
          data-testid="about-input"
        />
      </FormGroup>
    </>
  );
}
