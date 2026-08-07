import { useState } from 'react';
import { PiHeart, PiHeartFill } from 'react-icons/pi';
import styled from 'styled-components';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import type { ListingStatus } from '@/api/listings';
import { getFormatIcon } from '@/lib/getFormatIcon';
import { getStatusLabel } from '@/lib/utils';
import { useIsFavorited, useToggleFavorite } from '@/queries/useFavorites';
import { useAuthStore } from '@/store/auth-store';

interface ImageGalleryProps {
  images: string[];
  format?: string | null;
  title: string;
  listingId: string;
  isOwner: boolean;
  status?: ListingStatus;
}

export function ImageGallery({ images, format, title, listingId, isOwner, status }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { data: isFavorited = false } = useIsFavorited(user?.id, listingId);
  const { toggleFavorite, isLoading } = useToggleFavorite();

  const slides = images.map((src) => ({ src }));
  const showStatusBanner = status && status !== 'active';
  const hasImages = images.length > 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    toggleFavorite(user.id, listingId, isFavorited);
  };

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
              {getStatusLabel(status)}
            </StatusBanner>
          )}
          {hasImages && <ZoomHint>Click to view fullscreen</ZoomHint>}
          {user && !isOwner && (
            <FavoriteButton onClick={handleFavoriteClick} disabled={isLoading}>
              {isFavorited ? <PiHeartFill size={24} /> : <PiHeart size={24} />}
            </FavoriteButton>
          )}
          {images.length > 1 && (
            <>
              <ImageCounter>
                {selectedImage + 1} / {images.length}
              </ImageCounter>
              <NavButton $position="left" onClick={prevImage} aria-label="Previous image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </NavButton>
              <NavButton $position="right" onClick={nextImage} aria-label="Next image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </NavButton>
            </>
          )}
        </MainImageWrapper>

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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  min-width: 0;

  @media (min-width: 768px) {
    position: sticky;
    top: 5rem;
    align-self: start;
  }
`;

const MainImageWrapper = styled.div<{ $clickable: boolean }>`
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: ${({ $clickable }) => ($clickable ? 'zoom-in' : 'default')};
  background: ${({ theme }) => theme.background.secondary};

  &:hover > div {
    opacity: 1;
  }

  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

const StatusBanner = styled.div<{ $status: ListingStatus }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 2rem;
  background-color: ${(props) =>
    props.$status === 'sold' ? props.theme.status.sold.background : props.theme.status.hidden.background};
  color: ${(props) => (props.$status === 'sold' ? props.theme.status.sold.text : props.theme.status.hidden.text)};
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  z-index: 1;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
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
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  backdrop-filter: blur(8px);
`;

const ImageCounter = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${({ theme }) => theme.overlay.darker};
  color: white;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
  max-width: 480px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 0.5rem;
  }
`;

const ThumbnailWrapper = styled.div<{ $active: boolean }>`
  box-sizing: border-box;
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 2px solid ${({ theme, $active }) => ($active ? theme.primary.main : theme.border.primary)};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ $active, theme }) => ($active ? `0 0 0 2px ${theme.primary.light}` : 'none')};

  &:hover {
    border-color: ${({ theme }) => theme.primary.main};
    box-shadow: ${({ theme }) => theme.shadow.medium};
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
`;

const NavButton = styled.button<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $position }) => $position}: 1rem;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.overlay.dark};
  color: white;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  z-index: 2;

  ${MainImageWrapper}:hover & {
    opacity: 1;
  }

  &:hover {
    background: ${({ theme }) => theme.overlay.darker};
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    opacity: 1;
    width: 40px;
    height: 40px;
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.favorite};
  border: none;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  z-index: 2;

  &:hover {
    background: ${({ theme }) => theme.overlay.darker};
    transform: scale(1.1);
    color: ${({ theme }) => theme.favorite};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    width: 2.75rem;
    height: 2.75rem;
  }
`;
