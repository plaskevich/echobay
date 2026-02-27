import { useState } from 'react';

import { confirmPayment } from '@/api/checkout';
import { createChat, getChatByListing, sendOrderSystemMessages } from '@/api/messages';
import type { ShippingAddress } from '@/components/checkout/ShippingForm';
import { useAuthStore } from '@/store/auth-store';

interface UseOrderConfirmationProps {
  listingId: string;
  listingTitle: string;
  listingOwnerId: string;
  listingPrice: number;
  listingShippingPrice?: number;
  shippingAddress: ShippingAddress;
  paymentIntentId: string;
  onConfirmed?: () => void;
}

export function useOrderConfirmation({
  listingId,
  listingTitle,
  listingOwnerId,
  listingPrice,
  listingShippingPrice = 0,
  shippingAddress,
  paymentIntentId,
  onConfirmed,
}: UseOrderConfirmationProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleConfirmOrder = async () => {
    setProcessing(true);
    setError(null);

    try {
      const totalAmount = listingPrice + listingShippingPrice;
      const result = await confirmPayment({
        listingId,
        shippingAddress,
        paymentIntentId,
        amount: totalAmount,
      });

      if (!result.success || !result.orderId) {
        throw new Error(result.error || 'Failed to confirm order');
      }

      if (user) {
        await createChatAndSendMessages(user.id, result.orderId);
      }

      setConfirmed(true);
      onConfirmed?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  async function createChatAndSendMessages(userId: string, orderId: string) {
    try {
      const existingChat = await getChatByListing(userId, listingOwnerId, listingId);
      let chatId: string;

      if (existingChat.data) {
        chatId = existingChat.data.id;
      } else {
        const chatResult = await createChat(userId, listingOwnerId, listingId, orderId);
        if (chatResult.error || !chatResult.data) {
          throw new Error('Failed to create chat');
        }
        chatId = chatResult.data.id;
      }

      await sendOrderSystemMessages(chatId, userId, orderId, listingTitle, shippingAddress);
    } catch (err) {
      console.error('Chat creation failed after successful order:', err);
    }
  }

  return { processing, error, confirmed, handleConfirmOrder };
}
