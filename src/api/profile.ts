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

export async function fetchPublicProfile(userId: string) {
  return await supabase
    .from('profiles')
    .select('id, avatar_url, username, location, about, created_at')
    .eq('id', userId)
    .single();
}

export interface ProfileSummary {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export async function fetchProfilesByIds(userIds: string[]) {
  if (userIds.length === 0) return { data: [] as ProfileSummary[], error: null };
  const { data, error } = await supabase.from('profiles').select('id, username, avatar_url').in('id', userIds);
  if (error) return { data: null, error };
  return { data: data || [], error: null };
}

export async function upsertProfile(profileData: ProfileData) {
  return await supabase.from('profiles').upsert(profileData, {
    onConflict: 'id',
  });
}

export async function insertProfileIfNotExists(profileData: ProfileData) {
  return await supabase.from('profiles').upsert(profileData, {
    onConflict: 'id',
    ignoreDuplicates: true,
  });
}
