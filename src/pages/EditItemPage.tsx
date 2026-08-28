import { type ChangeEvent, type KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Dialog } from '@/components/common/Dialog';
import { Form } from '@/components/common/Form';
import { PageContainer as Container } from '@/components/common/PageContainer';
import { PageTitle } from '@/components/common/PageTitle';
import { LoadingState } from '@/components/common/StateDisplay';
import { DiscogsSearch } from '@/components/item/discogs-search';
import { FormActions } from '@/components/item/edit/FormActions';
import { FormFields } from '@/components/item/edit/FormFields';
import { ImageUploadSection } from '@/components/item/edit/ImageUploadSection';
import { type DiscogsRelease, extractArtistName, useDiscogsSearch } from '@/hooks/useDiscogsSearch';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useListingSubmit } from '@/hooks/useListingSubmit';
import { breakpoint } from '@/lib/theme/breakpoints';
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
  const [extraDirty, setExtraDirty] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const computedExistingImages = useMemo(() => {
    if (existingListing?.images && Array.isArray(existingListing.images)) {
      return existingListing.images;
    }
    return [];
  }, [existingListing]);

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
    reorderImages,
    uploadImages,
    resetImages,
    error: imageError,
    setImagePreviews,
  } = useImageUpload(user?.id);

  const {
    form,
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
    existingImages: imagePreviews.length > 0 ? imagePreviews : computedExistingImages,
  });

  const isDirty = form.formState.isDirty || extraDirty;

  useEffect(() => {
    if (!existingListing || mode !== 'edit') return;

    form.reset({
      title: existingListing.title || '',
      artist: existingListing.artist || '',
      year: existingListing.year?.toString() || '',
      format: existingListing.format || '',
      label: existingListing.label || '',
      condition: existingListing.condition || '',
      price: existingListing.price?.toFixed(2) || '',
      shipping_price: existingListing.shipping_price?.toFixed(2) || '',
      description: existingListing.description || '',
    });

    if (existingListing.images && Array.isArray(existingListing.images)) {
      setImagePreviews(existingListing.images);
    }
  }, [existingListing, mode, form, setImagePreviews]);

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
    setExtraDirty(true);
    await handleImageChange(e);
  };

  const removeImageWrapper = (index: number) => {
    setExtraDirty(true);
    removeImage(index);
  };

  const reorderImagesWrapper = (fromIndex: number, toIndex: number) => {
    setExtraDirty(true);
    reorderImages(fromIndex, toIndex);
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
    const current = form.getValues();
    form.setValue('title', release.title || current.title, { shouldDirty: true });
    form.setValue('artist', extractArtistName(release.artists) || current.artist, { shouldDirty: true });
    form.setValue('year', release.year ? String(release.year) : current.year, { shouldDirty: true });
    form.setValue('label', release.labels?.[0]?.name || current.label, { shouldDirty: true });

    const discogsMainGenres = release.genres || [];
    const discogsStyles = release.styles || [];

    if ((discogsMainGenres.length > 0 || discogsStyles.length > 0) && allGenres.length > 0) {
      const mainGenreIdSet = new Set(mainGenresList.map((g) => g.id));

      const matchedMainGenreIds = allGenres
        .filter(
          (dbGenre) =>
            mainGenreIdSet.has(dbGenre.id) &&
            discogsMainGenres.some((dg) => dg.toLowerCase() === dbGenre.name.toLowerCase())
        )
        .map((g) => g.id)
        .slice(0, 3);

      const matchedSubgenreIds = allGenres
        .filter(
          (dbGenre) =>
            !mainGenreIdSet.has(dbGenre.id) &&
            dbGenre.parent_id &&
            matchedMainGenreIds.includes(dbGenre.parent_id) &&
            discogsStyles.some((ds) => ds.toLowerCase() === dbGenre.name.toLowerCase())
        )
        .map((g) => g.id)
        .slice(0, 5);

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

  const handleFormKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    const target = event.target as HTMLElement;
    if (target instanceof HTMLTextAreaElement) {
      return;
    }

    event.preventDefault();
  };

  if (id && isLoadingListing) {
    return <LoadingState message="Loading listing data" />;
  }

  return (
    <Container>
      <StyledPageTitle>{mode === 'create' ? 'Sell Your Item' : 'Edit Listing'}</StyledPageTitle>

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

      <Form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
        <ImageUploadSection
          imagePreviews={imagePreviews}
          imageError={imageError}
          isSubmitting={isSubmitting}
          onImageChange={handleImageChangeWrapper}
          onRemoveImage={removeImageWrapper}
          onReorderImages={reorderImagesWrapper}
        />

        <FormFields
          register={form.register}
          errors={form.formState.errors}
          isSubmitting={isSubmitting}
          selectedMainGenreIds={selectedMainGenreIds}
          selectedSubgenreIds={selectedSubgenreIds}
          onMainGenresChange={(ids) => {
            setExtraDirty(true);
            setSelectedMainGenreIds(ids);
          }}
          onSubgenresChange={(ids) => {
            setExtraDirty(true);
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
    </Container>
  );
}

const StyledPageTitle = styled(PageTitle)`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${breakpoint.sm}) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;
