import { type FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useCreateListing, useUpdateListing } from '@/queries/useListings';

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
  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing();
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!listingId;

  const initialFormData: ListingFormData = {
    title: initialData?.title || '',
    artist: initialData?.artist || '',
    format: initialData?.format || '',
    genre: initialData?.genre || '',
    label: initialData?.label || '',
    condition: initialData?.condition || '',
    price: initialData?.price || '',
    description: initialData?.description || '',
  };

  const [formData, setFormData] = useState<ListingFormData>(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    resetImages();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.artist || !formData.format || !formData.price) {
      setError('Please fill in all required fields (Title, Artist, Format, Price)');
      return;
    }

    if (!userId) {
      setError('You must be logged in to create a listing');
      return;
    }

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
        await updateMutation.mutateAsync({ id: listingId, data: listingData });
      } else {
        await createMutation.mutateAsync(listingData);
      }

      toast.success(`Listing ${isEditMode ? 'updated' : 'created'} successfully!`);
      resetForm();

      if (isEditMode) {
        navigate(`/items/${listingId}`);
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `An error occurred while ${isEditMode ? 'updating' : 'creating'} the listing`
      );
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    error,
    handleSubmit,
    isEditMode,
  };
}
