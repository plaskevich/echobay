import { useState } from 'react';
import toast from 'react-hot-toast';

import type { ShippingAddress } from '@/components/checkout/ShippingForm';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { useSaveShippingAddress, useShippingAddress } from '@/queries/useShipping';
import { useAuthStore } from '@/store/auth-store';

import { Container, Description, Message, SectionTitle } from './styles';

export default function ShippingSettings() {
  const user = useAuthStore((s) => s.user);
  const { data: savedAddress, isLoading: isLoadingAddress } = useShippingAddress(user?.id);
  const saveShippingAddress = useSaveShippingAddress();
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (address: ShippingAddress) => {
    if (!user) return;
    setError(null);

    try {
      await saveShippingAddress.mutateAsync({ userId: user.id, address });
      toast.success('Shipping address saved successfully.');
    } catch {
      setError('Failed to save address. Please try again.');
    }
  };

  if (isLoadingAddress) return null;

  return (
    <Container data-testid="shipping-settings">
      <SectionTitle>Shipping Address</SectionTitle>
      <Description>Save a default shipping address for faster checkout</Description>

      {error && <Message $type="error">{error}</Message>}

      <ShippingForm
        onSubmit={handleSave}
        initialData={savedAddress || undefined}
        submitLabel="Save"
        isLoading={saveShippingAddress.isPending}
        title=""
      />
    </Container>
  );
}
