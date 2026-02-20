import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type ProfileData, fetchProfile, fetchPublicProfile, upsertProfile } from '@/api/profile';

export const profileKeys = {
  all: ['profiles'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (userId: string) => [...profileKeys.details(), userId] as const,
};

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.detail(userId || ''),
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await fetchProfile(userId);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || null;
    },
    enabled: !!userId,
  });
}

export function usePublicProfile(userId: string | undefined) {
  return useQuery({
    queryKey: [...profileKeys.detail(userId || ''), 'public'],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await fetchPublicProfile(userId);
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data || null;
    },
    enabled: !!userId,
  });
}

export function useUpsertProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: ProfileData) => {
      const { data, error } = await upsertProfile(profileData);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(variables.id) });
    },
  });
}
