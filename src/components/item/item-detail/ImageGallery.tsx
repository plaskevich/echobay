import { useState } from 'react';
import styled from 'styled-components';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import type { ListingStatus } from '@/api/listings';
import { getFormatIcon } from '@/lib/getFormatIcon';
import { getStatusLabel } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  format?: string | null;
  title: string;
  status?: ListingStatus;
}

export function ImageGallery({ images, format, title, status }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const slides = images.map((src) => ({ src }));
  const showStatusBanner = status && status !== 'active';
  const hasImages = images.length > 0;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <ImageSection>
        <NavButton onClick={prevImage} disabled={images.length < 2} aria-label="Previous image">
          <i className="hn hn-angle-left" aria-hidden />
        </NavButton>
        <MainImageWrapper onClick={hasImages ? () => setIsLightboxOpen(true) : undefined} $clickable={hasImages}>
          {hasImages ? (
            <MainImage src={images[selectedImage]} alt={title} />
          ) : (
            <MainImageFormatFallback aria-label="Listing format icon">
              {getFormatIcon(format, 200)}
            </MainImageFormatFallback>
          )}
          {showStatusBanner && (
            <StatusBanner $status={status!} data-testid="status-banner">
              <i className={status === 'sold' ? 'hn hn-tag-solid' : 'hn hn-eye-cross-solid'} />
              {getStatusLabel(status)}
            </StatusBanner>
          )}
          {hasImages && <ZoomHint>Click to view fullscreen</ZoomHint>}
          {images.length > 1 && (
            <ImageCounter>
              {selectedImage + 1} / {images.length}
            </ImageCounter>
          )}
        </MainImageWrapper>
        <NavButton onClick={nextImage} disabled={images.length < 2} aria-label="Next image">
          <i className="hn hn-angle-right" aria-hidden />
        </NavButton>

        {images.length > 1 && (
          <ThumbnailGrid>
            {images.map((image, index) => (
              <ThumbnailWrapper key={index} $active={selectedImage === index}>
                <Thumbnail src={image} alt={`${title} ${index + 1}`} onClick={() => setSelectedImage(index)} />
              </ThumbnailWrapper>
            ))}
          </ThumbnailGrid>
        )}
      </ImageSection>

      <Lightbox
        open={hasImages && isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={slides}
        index={selectedImage}
        on={{
          view: ({ index }) => setSelectedImage(index),
        }}
      />
    </>
  );
}

const ImageSection = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem 0.75rem;
  width: 100%;
  max-width: 600px;

  @media (min-width: 768px) {
    position: sticky;
    top: 5rem;
    align-self: start;
  }

  @media (max-width: 640px) {
    max-width: 100%;
    column-gap: 0.5rem;
  }
`;

const MainImageWrapper = styled.div<{ $clickable: boolean }>`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: ${({ $clickable }) => ($clickable ? 'zoom-in' : 'default')};
  background: ${({ theme }) => theme.background.secondary};

  &:hover > div {
    opacity: 1;
  }
`;

const StatusBanner = styled.div<{ $status: ListingStatus }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 1.25rem;
  background-color: ${(props) =>
    props.$status === 'sold' ? props.theme.primary.main : props.theme.background.tertiary};
  color: ${(props) => (props.$status === 'sold' ? props.theme.text.inverse : props.theme.text.primary)};
  font-size: 1.2rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  letter-spacing: 0.01em;
  z-index: 1;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transition.slow};
`;

const MainImageFormatFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text.tertiary};
  background: ${({ theme }) => theme.background.secondary};
`;

const ZoomHint = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.overlay.darker};
  color: ${({ theme }) => theme.text.inverse};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transition.slow};
  pointer-events: none;
  backdrop-filter: blur(8px);
`;

const ImageCounter = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${({ theme }) => theme.black.main};
  color: ${({ theme }) => theme.text.inverse};
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
`;

const ThumbnailGrid = styled.div`
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(auto-fill, 64px);
  gap: 0.75rem;
  width: 100%;
  min-width: 0;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, 48px);
    gap: 0.5rem;
  }
`;

const ThumbnailWrapper = styled.div<{ $active: boolean }>`
  box-sizing: border-box;
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.border.hover : 'transparent')};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.base};

  &:hover {
    border-color: ${({ theme }) => theme.border.primary};
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${({ theme }) => theme.transition.base};
`;

const NavButton = styled.button`
  flex: none;
  color: ${({ theme }) => theme.text.secondary};
  background: transparent;
  border: none;
  /* margin: 0 1rem; */
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.base};

  &:hover:not(:disabled) {
    transform: scale(1.2);
    color: ${({ theme }) => theme.text.primary};
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    visibility: hidden;
    cursor: default;
  }

  @media (max-width: 480px) {
    width: 2rem;
    height: 2rem;
    font-size: 1.25rem;
  }
`;
