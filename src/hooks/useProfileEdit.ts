import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { getPublicUrl, uploadImage } from '@/api/storage';
import { useProfile, useUpsertProfile } from '@/queries/useProfiles';
import { useAuthStore } from '@/store/auth-store';

export interface ProfileFormData {
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

  const form = useForm<ProfileFormData>({
    defaultValues: {
      username: '',
      location: '',
      about: '',
      avatar_url: '',
    },
  });

  useEffect(() => {
    if (existingProfile) {
      form.reset({
        username: existingProfile.username || '',
        location: existingProfile.location || '',
        about: existingProfile.about || '',
        avatar_url: existingProfile.avatar_url || '',
      });
    }
  }, [existingProfile, form]);

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

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      let avatarUrl = data.avatar_url;
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
        username: data.username,
        location: data.location,
        about: data.about,
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
    form,
    loading,
    submitting: upsertProfileMutation.isPending,
    avatarPreview,
    handleAvatarChange,
    removeAvatar,
    handleSubmit: form.handleSubmit(onSubmit),
    handleCancel,
  };
}
