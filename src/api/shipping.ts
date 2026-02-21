import type { ShippingAddress } from '@/components/checkout/ShippingForm';
import { supabase } from '@/lib/supabase';

export async function fetchShippingAddress(userId: string) {
  return await supabase.from('profiles').select('shipping_address').eq('id', userId).single();
}

export async function saveShippingAddress(userId: string, address: ShippingAddress) {
  return await supabase.from('profiles').update({ shipping_address: address }).eq('id', userId);
}
