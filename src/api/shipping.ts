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
  return await supabase.from('shipping_addresses').select('address').eq('user_id', userId).maybeSingle();
}

export async function saveShippingAddress(userId: string, address: ShippingAddress) {
  return await supabase.from('shipping_addresses').upsert({ user_id: userId, address });
}
