import { supabase } from '@/lib/supabase';

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export async function fetchShippingAddress(userId: string) {
  return await supabase.from('profiles').select('shipping_address').eq('id', userId).single();
}

export async function saveShippingAddress(userId: string, address: ShippingAddress) {
  return await supabase.from('profiles').update({ shipping_address: address }).eq('id', userId);
}
