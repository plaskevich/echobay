import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/lib/supabase';
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    location: '',
    about: '',
    avatar_url: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, location, about, avatar_url')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setProfileData({
            username: data.username || '',
            location: data.location || '',
            about: data.about || '',
            avatar_url: data.avatar_url || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setAvatarFile(file);
    setError(null);

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

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      let avatarUrl = profileData.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/avatar-${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true,
        });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('images').getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const { error: updateError } = await supabase.from('profiles').upsert({
        id: user.id,
        username: profileData.username,
        location: profileData.location,
        about: profileData.about,
        avatar_url: avatarUrl,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return {
    profileData,
    loading,
    submitting,
    error,
    success,
    avatarFile,
    avatarPreview,
    updateField,
    handleAvatarChange,
    removeAvatar,
    handleSubmit,
    handleCancel,
  };
}
