import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { paymentIntentId, listingId, shippingAddress } = await req.json();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client with user's auth
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the current user
    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // The expected total comes from the listing, never from the request body.
    // Comparing a client-sent amount against the payment intent compares two
    // client-controlled numbers and always passes.
    const { data: listing, error: listingError } = await supabaseClient
      .from('listings')
      .select('price, shipping_price')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      throw new Error('Listing not found');
    }

    const amount = Number(listing.price) + Number(listing.shipping_price ?? 0);

    // Verify the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment has not been completed');
    }

    // Without this, a payment for one listing can be redeemed against another
    // listing of the same price.
    if (paymentIntent.metadata?.listingId !== listingId) {
      throw new Error('Payment does not belong to this listing');
    }

    // Verify the amount matches
    if (paymentIntent.amount !== Math.round(amount * 100)) {
      throw new Error('Payment amount mismatch');
    }

    // Create order in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        listing_id: listingId,
        buyer_id: user.id,
        shipping_address: shippingAddress,
        amount: amount,
        stripe_payment_intent_id: paymentIntentId,
        status: 'confirmed',
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Update listing status to sold
    const { error: updateError } = await supabaseClient
      .from('listings')
      .update({ status: 'sold' })
      .eq('id', listingId)
      .select();

    if (updateError) {
      throw new Error(`Failed to update listing status: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
