import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Dialog } from '@/components/common/Dialog';
import { Form } from '@/components/common/Form';
import { DiscogsSearch } from '@/components/item/discogs-search';
import { FormActions } from '@/components/item/edit/FormActions';
import { FormFields } from '@/components/item/edit/FormFields';
import { ImageUploadSection } from '@/components/item/edit/ImageUploadSection';
import { type DiscogsRelease, extractArtistName, useDiscogsSearch } from '@/hooks/useDiscogsSearch';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useListingSubmit } from '@/hooks/useListingSubmit';
import { useGenres, useListingGenres, useMainGenres } from '@/queries/useGenres';
import { useListing } from '@/queries/useListings';
import { useAuthStore } from '@/store/auth-store';

interface ListingFormProps {
  mode?: 'create' | 'edit';
}

export function EditItemPage({ mode = 'create' }: ListingFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { data: existingListing, isLoading: isLoadingListing } = useListing(id || '');
  const { data: existingGenres = [] } = useListingGenres(mode === 'edit' ? id : undefined);
  const { data: allGenres = [] } = useGenres();
  const { data: mainGenresList = [] } = useMainGenres();
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const computedExistingImages = useMemo(() => {
    if (existingListing?.images && Array.isArray(existingListing.images)) {
      return existingListing.images;
    }
    return [];
  }, [existingListing]);

  const { computedExistingMainGenreIds, computedExistingSubgenreIds } = useMemo(() => {
    const mainGenreIdSet = new Set(mainGenresList.map((g) => g.id));
    const mainIds: string[] = [];
    const subIds: string[] = [];

    existingGenres.forEach((g) => {
      if (mainGenreIdSet.has(g.id)) {
        mainIds.push(g.id);
      } else {
        subIds.push(g.id);
      }
    });

    return { computedExistingMainGenreIds: mainIds, computedExistingSubgenreIds: subIds };
  }, [existingGenres, mainGenresList]);
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    performSearch,
    selectRelease,
    clearSearch,
  } = useDiscogsSearch();

  const {
    imagePreviews,
    handleImageChange,
    addImageFromUrl,
    removeImage,
    uploadImages,
    resetImages,
    error: imageError,
    setImagePreviews,
  } = useImageUpload(user?.id);

  const {
    formData,
    setFormData,
    selectedMainGenreIds,
    setSelectedMainGenreIds,
    selectedSubgenreIds,
    setSelectedSubgenreIds,
    isSubmitting,
    error,
    handleSubmit,
    isEditMode,
  } = useListingSubmit({
    userId: user?.id,
    uploadImages,
    resetImages,
    listingId: id,
    existingImages: computedExistingImages,
    initialMainGenreIds: computedExistingMainGenreIds,
    initialSubgenreIds: computedExistingSubgenreIds,
  });

  useEffect(() => {
    if (!existingListing || mode !== 'edit') return;

    setFormData({
      title: existingListing.title || '',
      artist: existingListing.artist || '',
      format: existingListing.format || '',
      label: existingListing.label || '',
      condition: existingListing.condition || '',
      price: existingListing.price?.toString() || '',
      description: existingListing.description || '',
    });

    if (existingListing.images && Array.isArray(existingListing.images)) {
      setImagePreviews(existingListing.images);
    }
  }, [existingListing, mode, setFormData, setImagePreviews]);

  useEffect(() => {
    if (existingGenres.length > 0 && mode === 'edit' && mainGenresList.length > 0) {
      const mainGenreIdSet = new Set(mainGenresList.map((g) => g.id));
      const mainIds: string[] = [];
      const subIds: string[] = [];

      existingGenres.forEach((g) => {
        if (mainGenreIdSet.has(g.id)) {
          mainIds.push(g.id);
        } else {
          subIds.push(g.id);
        }
      });

      setSelectedMainGenreIds(mainIds);
      setSelectedSubgenreIds(subIds);
    }
  }, [existingGenres, mode, mainGenresList, setSelectedMainGenreIds, setSelectedSubgenreIds]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      if (isEditMode && id) {
        navigate(`/items/${id}`);
      } else {
        navigate('/profile');
      }
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    if (isEditMode && id) {
      navigate(`/items/${id}`);
    } else {
      navigate('/profile');
    }
  };

  const handleImageChangeWrapper = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true);
    await handleImageChange(e);
  };

  const removeImageWrapper = (index: number) => {
    setIsDirty(true);
    removeImage(index);
  };

  const handleSearchSubmit = async () => {
    await performSearch();
    setShowSearchResults(true);
  };

  const handleSelectRelease = async (releaseId: number) => {
    const release = await selectRelease(releaseId);
    if (release) {
      await autoFillFormFromRelease(release);
      setShowSearchResults(false);
      clearSearch();
    }
  };

  const autoFillFormFromRelease = async (release: DiscogsRelease) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      title: release.title || prev.title,
      artist: extractArtistName(release.artists) || prev.artist,
    }));

    const discogsMainGenres = release.genres || [];
    const discogsStyles = release.styles || [];

    if ((discogsMainGenres.length > 0 || discogsStyles.length > 0) && allGenres.length > 0) {
      const mainGenreIdSet = new Set(mainGenresList.map((g) => g.id));

      // Match main genres from Discogs genres
      const matchedMainGenreIds = allGenres
        .filter(
          (dbGenre) =>
            mainGenreIdSet.has(dbGenre.id) &&
            discogsMainGenres.some((dg) => dg.toLowerCase() === dbGenre.name.toLowerCase())
        )
        .map((g) => g.id)
        .slice(0, 3); // Max 3 main genres

      // Match subgenres from Discogs styles, filtered by matched main genres
      const matchedSubgenreIds = allGenres
        .filter(
          (dbGenre) =>
            !mainGenreIdSet.has(dbGenre.id) &&
            dbGenre.parent_id &&
            matchedMainGenreIds.includes(dbGenre.parent_id) &&
            discogsStyles.some((ds) => ds.toLowerCase() === dbGenre.name.toLowerCase())
        )
        .map((g) => g.id)
        .slice(0, 5); // Max 5 subgenres

      if (matchedMainGenreIds.length > 0) {
        setSelectedMainGenreIds(matchedMainGenreIds);
      }
      if (matchedSubgenreIds.length > 0) {
        setSelectedSubgenreIds(matchedSubgenreIds);
      }
    }

    if (release.images && release.images.length > 0 && release.images[0]?.uri) {
      await addImageFromUrl(release.images[0].uri, `${release.title}-cover.jpg`);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowSearchResults(false);
  };

  if (isLoadingListing) {
    return <div>Loading listing data...</div>;
  }

  return (
    <>
      <Title>{mode === 'create' ? 'Sell Your Item' : 'Edit Listing'}</Title>

      <DiscogsSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        isSearching={isSearching}
        searchError={searchError}
        showSearchResults={showSearchResults}
        isDisabled={isSubmitting}
        onSearch={handleSearchSubmit}
        onSelectRelease={handleSelectRelease}
        onClear={handleClearSearch}
      />

      <Form onSubmit={handleSubmit}>
        <ImageUploadSection
          imagePreviews={imagePreviews}
          imageError={imageError}
          isSubmitting={isSubmitting}
          onImageChange={handleImageChangeWrapper}
          onRemoveImage={removeImageWrapper}
        />

        <FormFields
          formData={formData}
          isSubmitting={isSubmitting}
          onChange={handleInputChange}
          selectedMainGenreIds={selectedMainGenreIds}
          selectedSubgenreIds={selectedSubgenreIds}
          onMainGenresChange={(ids) => {
            setIsDirty(true);
            setSelectedMainGenreIds(ids);
          }}
          onSubgenresChange={(ids) => {
            setIsDirty(true);
            setSelectedSubgenreIds(ids);
          }}
        />

        <FormActions error={error} isSubmitting={isSubmitting} onCancel={handleCancel} mode={mode} />
      </Form>

      <Dialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave this page?"
        confirmText="Leave Page"
        cancelText="Stay"
      />
    </>
  );
}

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.text.primary};
  margin-bottom: 2rem;
`;
