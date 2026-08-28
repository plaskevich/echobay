import { supabase } from '@/lib/supabase';

const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1';

interface CheckoutData {
  listingId: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentIntentId: string;
}

interface OrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

export async function createPaymentIntent(
  listingId: string
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ listingId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment intent');
    }

    const data = await response.json();
    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function confirmPayment(checkoutData: CheckoutData): Promise<OrderResult> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        paymentIntentId: checkoutData.paymentIntentId,
        listingId: checkoutData.listingId,
        shippingAddress: checkoutData.shippingAddress,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to confirm payment',
      };
    }

    return {
      success: true,
      orderId: data.orderId,
    };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
