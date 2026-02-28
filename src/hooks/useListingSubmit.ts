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

  function buildListingData(data: ListingFormData, images: string[]) {
    const parsedPrice = parseFloat(data.price);
    const parsedShipping = data.shipping_price ? parseFloat(data.shipping_price) : 0;
    const parsedYear = data.year ? parseInt(data.year, 10) : null;

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) throw new Error('Invalid price');
    if (Number.isNaN(parsedShipping) || parsedShipping < 0) throw new Error('Invalid shipping price');
    if (parsedYear !== null && Number.isNaN(parsedYear)) throw new Error('Invalid year');

    return {
      owner_id: userId!,
      title: data.title,
      artist: data.artist,
      year: parsedYear,
      format: data.format,
      label: data.label || null,
      condition: data.condition || null,
      price: parsedPrice,
      shipping_price: parsedShipping,
      description: data.description || null,
      images,
    };
  }

  async function saveListing(listingData: ReturnType<typeof buildListingData>) {
    if (isEditMode) {
      await updateMutation.mutateAsync({ id: listingId, data: listingData });
      return listingId;
    }
    const result = await createMutation.mutateAsync(listingData);
    const created = Array.isArray(result) ? result[0] : result;
    return created?.id ?? '';
  }

  const onSubmit = async (data: ListingFormData) => {
    setError(null);

    if (!userId) {
      setError('You must be logged in to create a listing');
      return;
    }

    try {
      const uploadedUrls = await uploadImages();
      let uploadIndex = 0;
      const allImages = existingImages
        .map((preview) => {
          if (preview.startsWith('data:')) {
            return uploadedUrls[uploadIndex++];
          }
          return preview;
        })
        .filter((url): url is string => !!url);

      const listingData = buildListingData(data, allImages);
      const savedListingId = await saveListing(listingData);

      if (savedListingId) {
        await setListingGenres(savedListingId, selectedGenreIds);
      }

      toast.success(`Listing ${isEditMode ? 'updated' : 'created'} successfully!`);
      resetForm();
      navigate(isEditMode ? `/items/${listingId}` : '/profile');
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
