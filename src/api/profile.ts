import { supabase } from '@/lib/supabase';

export interface ProfileData {
  id: string;
  username?: string;
  avatar_url?: string;
  location?: string;
  about?: string;
}

export async function fetchProfile(userId: string) {
  return await supabase.from('profiles').select('avatar_url, username, location, about').eq('id', userId).single();
}

export async function upsertProfile(profileData: ProfileData) {
  return await supabase.from('profiles').upsert(profileData, {
    onConflict: 'id',
  });
}
