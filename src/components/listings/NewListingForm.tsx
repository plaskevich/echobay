import { type ChangeEvent, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';
import {
  ButtonGroup,
  FileInput,
  Form,
  FormGroup,
  Input,
  Label,
  OptionalLabel,
  Select,
  TextArea,
} from '@/components/common/Form';
import { ImagePreview, ImagePreviewContainer, PreviewImage, RemoveImageButton } from '@/components/common/ImageUpload';
import { ErrorMessage, SuccessMessage } from '@/components/common/Message';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useListingSubmit } from '@/hooks/useListingSubmit';
import { CONDITION_OPTIONS, FORMAT_OPTIONS } from '@/lib/constants/listings';
import { useAuthStore } from '@/store/auth-store';

export function NewListingForm() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const {
    imagePreviews,
    handleImageChange,
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

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="images">
            Images <OptionalLabel>(optional, max 8)</OptionalLabel>
          </Label>
          <FileInput
            accept="image/*"
            id="images"
            multiple
            onChange={handleImageChangeWrapper}
            type="file"
            disabled={isSubmitting}
          />
          {imageError && <ErrorMessage>{imageError}</ErrorMessage>}
          {imagePreviews.length > 0 && (
            <ImagePreviewContainer>
              {imagePreviews.map((preview, index) => (
                <ImagePreview key={index}>
                  <PreviewImage alt={`Preview ${index + 1}`} src={preview} />
                  <RemoveImageButton
                    onClick={() => removeImageWrapper(index)}
                    type="button"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    ×
                  </RemoveImageButton>
                </ImagePreview>
              ))}
            </ImagePreviewContainer>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            onChange={handleInputChange}
            placeholder="Enter album/item title"
            required
            type="text"
            value={formData.title}
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="artist">Artist *</Label>
          <Input
            id="artist"
            name="artist"
            onChange={handleInputChange}
            placeholder="Enter artist name"
            required
            type="text"
            value={formData.artist}
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="format">Format *</Label>
          <Select
            id="format"
            name="format"
            onChange={handleInputChange}
            required
            value={formData.format}
            disabled={isSubmitting}
          >
            {FORMAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="genre">
            Genre <OptionalLabel>(optional)</OptionalLabel>
          </Label>
          <Input
            id="genre"
            name="genre"
            onChange={handleInputChange}
            placeholder="e.g., Rock, Jazz, Electronic"
            type="text"
            value={formData.genre}
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="label">
            Label <OptionalLabel>(optional)</OptionalLabel>
          </Label>
          <Input
            id="label"
            name="label"
            onChange={handleInputChange}
            placeholder="Enter record label"
            type="text"
            value={formData.label}
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="condition">Condition *</Label>
          <Select
            id="condition"
            name="condition"
            onChange={handleInputChange}
            value={formData.condition}
            disabled={isSubmitting}
          >
            {CONDITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="price">Price*</Label>
          <Input
            id="price"
            min="0"
            name="price"
            onChange={handleInputChange}
            placeholder="0.00"
            required
            step="0.01"
            type="number"
            value={formData.price}
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">
            Description <OptionalLabel>(optional)</OptionalLabel>
          </Label>
          <TextArea
            id="description"
            name="description"
            onChange={handleInputChange}
            placeholder="Add any additional details about the item..."
            value={formData.description}
            disabled={isSubmitting}
          />
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button onClick={handleCancel} type="button" variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button isLoading={isSubmitting} type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
}
