import { supabase } from '@/lib/supabase';

const DEFAULT_BUCKET = 'listings';

export async function uploadImage(
  filePath: string,
  file: File,
  options?: { cacheControl?: string; upsert?: boolean },
  bucket = DEFAULT_BUCKET
) {
  return await supabase.storage.from(bucket).upload(filePath, file, options);
}

export function getPublicUrl(filePath: string, bucket = DEFAULT_BUCKET) {
  return supabase.storage.from(bucket).getPublicUrl(filePath);
}
