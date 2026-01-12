import { supabase } from '@/lib/supabase';

export async function uploadImage(filePath: string, file: File, options?: { cacheControl?: string; upsert?: boolean }) {
  return await supabase.storage.from('images').upload(filePath, file, options);
}

export function getPublicUrl(filePath: string) {
  return supabase.storage.from('images').getPublicUrl(filePath);
}
