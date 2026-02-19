import { type FormEvent, useState } from 'react';
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
  initialData?: Partial<ListingFormData>;
  existingImages?: string[];
  initialMainGenreIds?: string[];
  initialSubgenreIds?: string[];
}

export function useListingSubmit({
  userId,
  uploadImages,
  resetImages,
  listingId,
  initialData,
  existingImages = [],
  initialMainGenreIds = [],
  initialSubgenreIds = [],
}: UseListingSubmitProps) {
  const navigate = useNavigate();
  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing();
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!listingId;

  const initialFormData: ListingFormData = {
    title: initialData?.title || '',
    artist: initialData?.artist || '',
    year: initialData?.year || '',
    format: initialData?.format || '',
    label: initialData?.label || '',
    condition: initialData?.condition || '',
    price: initialData?.price || '',
    shipping_price: initialData?.shipping_price || '',
    description: initialData?.description || '',
  };

  const [formData, setFormData] = useState<ListingFormData>(initialFormData);
  const [selectedMainGenreIds, setSelectedMainGenreIds] = useState<string[]>(initialMainGenreIds);
  const [selectedSubgenreIds, setSelectedSubgenreIds] = useState<string[]>(initialSubgenreIds);
  const selectedGenreIds = [...selectedMainGenreIds, ...selectedSubgenreIds];

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedMainGenreIds([]);
    setSelectedSubgenreIds([]);
    resetImages();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.artist || !formData.format || !formData.price || !formData.shipping_price) {
      setError('Please fill in all required fields (Title, Artist, Format, Price, Shipping Price)');
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
        year: formData.year ? parseInt(formData.year, 10) : null,
        format: formData.format,
        label: formData.label || null,
        condition: formData.condition || null,
        price: parseFloat(formData.price),
        shipping_price: formData.shipping_price ? parseFloat(formData.shipping_price) : 0,
        description: formData.description || null,
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
    formData,
    setFormData,
    selectedMainGenreIds,
    setSelectedMainGenreIds,
    selectedSubgenreIds,
    setSelectedSubgenreIds,
    selectedGenreIds,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    error,
    handleSubmit,
    isEditMode,
  };
}
