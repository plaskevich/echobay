import { FormGroup, Input, Label, TextArea } from '@/components/common/Form';

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
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="City, Country"
          disabled={disabled}
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
