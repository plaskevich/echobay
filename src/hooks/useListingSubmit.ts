import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { setListingGenres } from '@/api/genres';
import { useCreateListing, useUpdateListing } from '@/queries/useListings';

export interface ListingFormData {
  title: string;
  artist: string;
  year: string;
  format: 'vinyl' | 'cd' | 'tape' | '';
  label: string;
  condition: string;
  price: string;
  shipping_price: string;
  description: string;
}

interface UseListingSubmitProps {
  userId: string | undefined;
  uploadImages: () => Promise<string[]>;
  resetImages: () => void;
  listingId?: string;
  existingImages?: string[];
  initialMainGenreIds?: string[];
  initialSubgenreIds?: string[];
}

export function useListingSubmit({
  userId,
  uploadImages,
  resetImages,
  listingId,
  existingImages = [],
  initialMainGenreIds = [],
  initialSubgenreIds = [],
}: UseListingSubmitProps) {
  const navigate = useNavigate();
  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing();
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!listingId;

  const form = useForm<ListingFormData>({
    defaultValues: {
      title: '',
      artist: '',
      year: '',
      format: '',
      label: '',
      condition: '',
      price: '',
      shipping_price: '',
      description: '',
    },
  });

  const [selectedMainGenreIds, setSelectedMainGenreIds] = useState<string[]>(initialMainGenreIds);
  const [selectedSubgenreIds, setSelectedSubgenreIds] = useState<string[]>(initialSubgenreIds);
  const selectedGenreIds = [...selectedMainGenreIds, ...selectedSubgenreIds];

  const resetForm = () => {
    form.reset();
    setSelectedMainGenreIds([]);
    setSelectedSubgenreIds([]);
    resetImages();
  };

  const onSubmit = async (data: ListingFormData) => {
    setError(null);

    if (!userId) {
      setError('You must be logged in to create a listing');
      return;
    }

    try {
      const imageUrls = await uploadImages();

      const allImages = imageUrls.length > 0 ? imageUrls : existingImages;

      const listingData = {
        owner_id: userId,
        title: data.title,
        artist: data.artist,
        year: data.year ? parseInt(data.year, 10) : null,
        format: data.format,
        label: data.label || null,
        condition: data.condition || null,
        price: parseFloat(data.price),
        shipping_price: data.shipping_price ? parseFloat(data.shipping_price) : 0,
        description: data.description || null,
        images: allImages,
      };

      let savedListingId: string;

      if (isEditMode) {
        await updateMutation.mutateAsync({ id: listingId, data: listingData });
        savedListingId = listingId;
      } else {
        const result = await createMutation.mutateAsync(listingData);
        savedListingId = (result as { id: string }[])?.[0]?.id || listingId || '';
      }

      if (savedListingId && selectedGenreIds.length > 0) {
        await setListingGenres(savedListingId, selectedGenreIds);
      } else if (savedListingId && isEditMode) {
        await setListingGenres(savedListingId, []);
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
    form,
    selectedMainGenreIds,
    setSelectedMainGenreIds,
    selectedSubgenreIds,
    setSelectedSubgenreIds,
    selectedGenreIds,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    error,
    handleSubmit: form.handleSubmit(onSubmit),
    isEditMode,
  };
}
