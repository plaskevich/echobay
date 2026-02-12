import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

import { ButtonRow, Container, Description, FieldRow, Form, Message, SectionTitle } from './styles';

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const emptyAddress: ShippingAddress = {
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
};

export default function ShippingSettings() {
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isValid =
    address.fullName && address.addressLine1 && address.city && address.state && address.zipCode && address.country;

  const handleChange = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      // TODO: integrate with backend to save shipping address
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessage({ type: 'success', text: 'Shipping address saved successfully.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save address. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <SectionTitle>Shipping Address</SectionTitle>
      <Description>Save a default shipping address for faster checkout</Description>

      <Form onSubmit={handleSave}>
        <Input
          label="Full Name"
          value={address.fullName}
          onChange={handleChange('fullName')}
          placeholder="John Doe"
          required
        />
        <Input
          label="Address Line 1"
          value={address.addressLine1}
          onChange={handleChange('addressLine1')}
          placeholder="123 Main St"
          required
        />
        <Input
          label="Address Line 2"
          value={address.addressLine2}
          onChange={handleChange('addressLine2')}
          placeholder="Apt, suite, unit, etc. (optional)"
        />
        <FieldRow>
          <Input label="City" value={address.city} onChange={handleChange('city')} placeholder="City" required />
          <Input
            label="State / Province"
            value={address.state}
            onChange={handleChange('state')}
            placeholder="State"
            required
          />
        </FieldRow>
        <FieldRow>
          <Input
            label="ZIP / Postal Code"
            value={address.zipCode}
            onChange={handleChange('zipCode')}
            placeholder="12345"
            required
          />
          <Input
            label="Country"
            value={address.country}
            onChange={handleChange('country')}
            placeholder="United States"
            required
          />
        </FieldRow>

        {message && <Message $type={message.type}>{message.text}</Message>}

        <ButtonRow>
          <Button type="submit" disabled={!isValid} isLoading={isSaving}>
            Save
          </Button>
        </ButtonRow>
      </Form>
    </Container>
  );
}
