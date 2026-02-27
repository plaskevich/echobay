import { type ChangeEvent } from 'react';

import { FileInput, FormGroup, Label } from '@/components/common/Form';
import { ImagePreview, ImagePreviewContainer, PreviewImage, RemoveImageButton } from '@/components/common/ImageUpload';
import { ErrorMessage } from '@/components/common/Message';

interface ImageUploadSectionProps {
  imagePreviews: string[];
  imageError: string | null;
  isSubmitting: boolean;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveImage: (index: number) => void;
}

export function ImageUploadSection({
  imagePreviews,
  imageError,
  isSubmitting,
  onImageChange,
  onRemoveImage,
}: ImageUploadSectionProps) {
  return (
    <FormGroup>
      <Label htmlFor="images">Images</Label>
      <FileInput accept="image/*" id="images" multiple onChange={onImageChange} type="file" disabled={isSubmitting} />
      {imageError && <ErrorMessage>{imageError}</ErrorMessage>}
      {imagePreviews.length > 0 && (
        <ImagePreviewContainer>
          {imagePreviews.map((preview, index) => (
            <ImagePreview key={preview}>
              <PreviewImage alt={`Preview ${index + 1}`} src={preview} />
              <RemoveImageButton
                onClick={() => onRemoveImage(index)}
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
  );
}
