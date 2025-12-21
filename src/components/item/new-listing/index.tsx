import { type ChangeEvent, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { Dialog } from '@/components/common/Dialog';
import { Form } from '@/components/common/Form';
import { SuccessMessage } from '@/components/common/Message';
import { DiscogsSearch } from '@/components/item/discogs-search';
import { FormActions } from '@/components/item/new-listing/FormActions';
import { FormFields } from '@/components/item/new-listing/FormFields';
import { ImageUploadSection } from '@/components/item/new-listing/ImageUploadSection';
import { type DiscogsRelease, extractArtistName, extractGenre, useDiscogsSearch } from '@/hooks/useDiscogsSearch';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useListingSubmit } from '@/hooks/useListingSubmit';
import { useAuthStore } from '@/store/auth-store';

export function NewListingForm() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

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
  } = useImageUpload(user?.id);

  const { formData, setFormData, isSubmitting, error, success, handleSubmit } = useListingSubmit({
    userId: user?.id,
    uploadImages,
    resetImages,
  });

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
      navigate({ to: '/catalog' });
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    navigate({ to: '/catalog' });
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
      genre: extractGenre(release.genres, release.styles) || prev.genre,
    }));

    if (release.images && release.images.length > 0 && release.images[0]?.uri) {
      await addImageFromUrl(release.images[0].uri, `${release.title}-cover.jpg`);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowSearchResults(false);
  };

  return (
    <>
      {success && <SuccessMessage>Listing created successfully! Redirecting...</SuccessMessage>}

      <Dialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave this page?"
        confirmText="Leave Page"
        cancelText="Stay"
      />

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

        <FormFields formData={formData} isSubmitting={isSubmitting} onChange={handleInputChange} />

        <FormActions error={error} isSubmitting={isSubmitting} onCancel={handleCancel} />
      </Form>
    </>
  );
}
