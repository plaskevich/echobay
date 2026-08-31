import { supabase } from '@/lib/supabase';

const BUCKET = 'listings';

export async function uploadImage(filePath: string, file: File, options?: { cacheControl?: string; upsert?: boolean }) {
  return await supabase.storage.from(BUCKET).upload(filePath, file, options);
}

export function getPublicUrl(filePath: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(filePath);
}
