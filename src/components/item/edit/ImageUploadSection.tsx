import { type ChangeEvent, useRef, useState } from 'react';
import styled from 'styled-components';

import { FileInput, FormGroup, Label } from '@/components/common/Form';
import { ErrorMessage } from '@/components/common/Message';
import { breakpoint } from '@/lib/theme/breakpoints';

interface ImageUploadSectionProps {
  imagePreviews: string[];
  imageError: string | null;
  isSubmitting: boolean;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemoveImage: (index: number) => void;
  onReorderImages: (fromIndex: number, toIndex: number) => void;
}

export function ImageUploadSection({
  imagePreviews,
  imageError,
  isSubmitting,
  onImageChange,
  onRemoveImage,
  onReorderImages,
}: ImageUploadSectionProps) {
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex !== null && fromIndex !== toIndex) {
      onReorderImages(fromIndex, toIndex);
    }
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  return (
    <FormGroup>
      <Label htmlFor="images">Images</Label>
      <FileInput accept="image/*" id="images" multiple onChange={onImageChange} type="file" disabled={isSubmitting} />
      {imageError && <ErrorMessage>{imageError}</ErrorMessage>}
      {imagePreviews.length > 0 && (
        <ImagePreviewContainer>
          {imagePreviews.map((preview, index) => (
            <ImagePreview
              key={preview}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              $dragOver={dragOverIndex === index}
            >
              <PreviewImage alt={`Preview ${index + 1}`} src={preview} />
              {index === 0 && <MainBadge>Main</MainBadge>}
              <RemoveImageButton
                onClick={() => onRemoveImage(index)}
                type="button"
                aria-label={`Remove image ${index + 1}`}
              >
                <i className="hn hn-times" aria-hidden />
              </RemoveImageButton>
            </ImagePreview>
          ))}
        </ImagePreviewContainer>
      )}
    </FormGroup>
  );
}

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (max-width: ${breakpoint.xs}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const ImagePreview = styled.div<{ $dragOver?: boolean }>`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.border.primary};
  cursor: grab;
  opacity: ${(props) => (props.$dragOver ? 0.5 : 1)};
  outline: ${(props) => (props.$dragOver ? `2px dashed ${props.theme.border.primary}` : 'none')};

  &:active {
    cursor: grabbing;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

const MainBadge = styled.span`
  position: absolute;
  bottom: 0.25rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => props.theme.overlay.dark};
  color: ${(props) => props.theme.text.inverse};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  padding: 0.15rem 0.35rem;
  line-height: 1.2;
  pointer-events: none;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: ${(props) => props.theme.overlay.dark};
  color: ${(props) => props.theme.text.inverse};
  border: none;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xl};
  line-height: 1;

  &:hover {
    background-color: ${(props) => props.theme.overlay.darker};
  }
`;
