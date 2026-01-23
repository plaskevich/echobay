import { FormGroup, Input, Label, TextArea } from '@/components/common/Form';
import { LocationAutocomplete } from '@/components/common/LocationAutocomplete';

interface ProfileFormFieldsProps {
  username: string;
  location: string;
  about: string;
  onUsernameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onAboutChange: (value: string) => void;
  disabled?: boolean;
}

export function ProfileFormFields({
  username,
  location,
  about,
  onUsernameChange,
  onLocationChange,
  onAboutChange,
  disabled,
}: ProfileFormFieldsProps) {
  return (
    <>
      <FormGroup>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Enter your username"
          disabled={disabled}
        />
      </FormGroup>

      <FormGroup>
        <LocationAutocomplete
          id="location"
          value={location}
          onChange={onLocationChange}
          placeholder="City, Country"
          disabled={disabled}
          label="Location"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="about">About You</Label>
        <TextArea
          id="about"
          value={about}
          onChange={(e) => onAboutChange(e.target.value)}
          placeholder="Tell us about yourself..."
          disabled={disabled}
          rows={6}
        />
      </FormGroup>
    </>
  );
}
