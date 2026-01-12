import { type ChangeEvent, useState } from 'react';

import { getPublicUrl, uploadImage } from '@/api/storage';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGES_PER_LISTING,
  MAX_IMAGE_DIMENSION,
  MAX_IMAGE_SIZE,
} from '@/lib/constants/listings';

interface UseImageUploadReturn {
  images: File[];
  imagePreviews: string[];
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  addImageFromUrl: (url: string, filename?: string) => Promise<void>;
  removeImage: (index: number) => void;
  uploadImages: () => Promise<string[]>;
  resetImages: () => void;
  error: string | null;
  clearError: () => void;
  setImagePreviews: (previews: string[]) => void;
}

async function compressImage(file: File, maxDimension: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          0.85 // Quality: 85%
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

export function useImageUpload(userId: string | undefined): UseImageUploadReturn {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    const newFiles = Array.from(files);

    if (images.length + newFiles.length > MAX_IMAGES_PER_LISTING) {
      setError(`You can only upload up to ${MAX_IMAGES_PER_LISTING} images per listing`);
      return;
    }

    const validatedFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of newFiles) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only JPEG, PNG, WebP, and GIF images are allowed.`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setError(`File too large: ${file.name}. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`);
        continue;
      }

      try {
        const compressedFile = await compressImage(file, MAX_IMAGE_DIMENSION);
        validatedFiles.push(compressedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === validatedFiles.length) {
            setImagePreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        setError(`Failed to process image: ${file.name}`);
        console.error('Image compression error:', err);
      }
    }

    if (validatedFiles.length > 0) {
      setImages((prev) => [...prev, ...validatedFiles]);
    }
    e.target.value = '';
  };

  const addImageFromUrl = async (url: string, filename = 'discogs-image.jpg') => {
    if (images.length >= MAX_IMAGES_PER_LISTING) {
      setError(`You can only upload up to ${MAX_IMAGES_PER_LISTING} images per listing`);
      return;
    }

    setError(null);

    try {
      const proxyUrl = 'https://corsproxy.io/?';
      const imageUrl = proxyUrl + encodeURIComponent(url);
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image from URL');
      }

      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError('Invalid image type from Discogs. Only JPEG, PNG, WebP, and GIF are allowed.');
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setError(`Image from Discogs is too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`);
        return;
      }
      const compressedFile = await compressImage(file, MAX_IMAGE_DIMENSION);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(compressedFile);
      setImages((prev) => [...prev, compressedFile]);
    } catch (err) {
      console.error('Error loading image from URL:', err);
      setError('Failed to load image from Discogs. You can still upload your own images manually.');
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `listings/${userId}/${fileName}`;

      const { error: uploadError } = await uploadImage(filePath, image);

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const resetImages = () => {
    setImages([]);
    setImagePreviews([]);
    setError(null);
  };

  return {
    images,
    imagePreviews,
    handleImageChange,
    addImageFromUrl,
    removeImage,
    uploadImages,
    resetImages,
    error,
    clearError,
    setImagePreviews,
  };
}
