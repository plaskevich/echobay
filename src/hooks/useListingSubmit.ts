import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  listingId?: string;
  initialData?: Partial<ListingFormData>;
  existingImages?: string[];
}

export function useListingSubmit({
  userId,
  uploadImages,
  resetImages,
  listingId,
  initialData,
  existingImages = [],
}: UseListingSubmitProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const isEditMode = !!listingId;

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

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        artist: initialData.artist || '',
        format: initialData.format || '',
        genre: initialData.genre || '',
        label: initialData.label || '',
        condition: initialData.condition || '',
        price: initialData.price || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

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

      const allImages = imageUrls.length > 0 ? imageUrls : existingImages;

      const listingData = {
        owner_id: userId,
        title: formData.title,
        artist: formData.artist,
        format: formData.format,
        genre: formData.genre || null,
        label: formData.label || null,
        condition: formData.condition || null,
        price: parseFloat(formData.price),
        description: formData.description || null,
        images: allImages,
      };

      if (isEditMode) {
        const { error: updateError } = await supabase.from('listings').update(listingData).eq('id', listingId);

        if (updateError) {
          throw new Error(`Failed to update listing: ${updateError.message}`);
        }
      } else {
        const { error: insertError } = await supabase.from('listings').insert(listingData);

        if (insertError) {
          throw new Error(`Failed to create listing: ${insertError.message}`);
        }
      }

      setSuccess(true);
      resetForm();

      setTimeout(() => {
        if (isEditMode) {
          navigate(`/items/${listingId}`);
        } else {
          navigate('/catalog');
        }
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `An error occurred while ${isEditMode ? 'updating' : 'creating'} the listing`
      );
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
    isEditMode,
  };
}
