import { useState } from 'react';
import styled from 'styled-components';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <ImageSection>
      <MainImage src={images[selectedImage]} alt={title} />
      {images.length > 1 && (
        <ThumbnailGrid>
          {images.map((image, index) => (
            <Thumbnail
              key={index}
              src={image}
              alt={`${title} ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              $active={selectedImage === index}
            />
          ))}
        </ThumbnailGrid>
      )}
    </ImageSection>
  );
}

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainImage = styled.img`
  width: 100%;
  max-width: 700px;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 1.25rem;
  border: 1px solid ${({ theme }) => theme.border.primary};
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
`;

const Thumbnail = styled.img<{ $active: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 0.75rem;
  border: 2px solid ${({ theme, $active }) => ($active ? theme.primary.main : theme.border.primary)};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.primary.main};
  }
`;
