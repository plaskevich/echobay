import { type FormEvent, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { supabase } from '@/lib/supabase';

export interface ListingFormData {
  title: string;
  artist: string;
  format: 'vinyl' | 'cd' | 'tape' | '';
  genre: string;
  label: string;
  condition: string;
  price: string;
  description: string;
}

interface UseListingSubmitProps {
  userId: string | undefined;
  uploadImages: () => Promise<string[]>;
  resetImages: () => void;
}

export function useListingSubmit({ userId, uploadImages, resetImages }: UseListingSubmitProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const initialFormData: ListingFormData = {
    title: '',
    artist: '',
    format: '',
    genre: '',
    label: '',
    condition: '',
    price: '',
    description: '',
  };

  const [formData, setFormData] = useState<ListingFormData>(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    resetImages();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title || !formData.artist || !formData.format || !formData.price) {
      setError('Please fill in all required fields (Title, Artist, Format, Price)');
      return;
    }

    if (!userId) {
      setError('You must be logged in to create a listing');
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls = await uploadImages();

      const { error: insertError } = await supabase.from('listings').insert({
        owner_id: userId,
        title: formData.title,
        artist: formData.artist,
        format: formData.format,
        genre: formData.genre || null,
        label: formData.label || null,
        condition: formData.condition || null,
        price: parseFloat(formData.price),
        description: formData.description || null,
        images: imageUrls,
      });

      if (insertError) {
        throw new Error(`Failed to create listing: ${insertError.message}`);
      }

      setSuccess(true);
      resetForm();

      setTimeout(() => {
        navigate({ to: '/catalog' });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    error,
    success,
    handleSubmit,
  };
}
