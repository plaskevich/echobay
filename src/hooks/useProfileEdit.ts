import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { getPublicUrl, uploadImage } from '@/api/storage';
import { useProfile, useUpsertProfile } from '@/queries/useProfiles';
import { useAuthStore } from '@/store/auth-store';

interface ProfileData {
  username: string;
  location: string;
  about: string;
  avatar_url: string;
}

export function useProfileEdit() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { data: existingProfile, isLoading: loading } = useProfile(user?.id);
  const upsertProfileMutation = useUpsertProfile();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    location: '',
    about: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (existingProfile) {
      setProfileData({
        username: existingProfile.username || '',
        location: existingProfile.location || '',
        about: existingProfile.about || '',
        avatar_url: existingProfile.avatar_url || '',
      });
    }
  }, [existingProfile]);

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let avatarUrl = profileData.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/avatar-${fileName}`;

        const { error: uploadError } = await uploadImage(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true,
        });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      await upsertProfileMutation.mutateAsync({
        id: user.id,
        username: profileData.username,
        location: profileData.location,
        about: profileData.about,
        avatar_url: avatarUrl,
      });

      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return {
    profileData,
    loading,
    submitting: upsertProfileMutation.isPending,
    avatarFile,
    avatarPreview,
    updateField,
    handleAvatarChange,
    removeAvatar,
    handleSubmit,
    handleCancel,
  };
}
