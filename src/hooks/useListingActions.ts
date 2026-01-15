import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useDeleteListing, useHideListing, useMarkListingAsSold, useSetListingActive } from '@/queries/useListings';

export function useListingActions(listingId: string) {
  const navigate = useNavigate();
  const markAsSoldMutation = useMarkListingAsSold();
  const hideMutation = useHideListing();
  const setActiveMutation = useSetListingActive();
  const deleteMutation = useDeleteListing();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSetActive = async () => {
    try {
      await setActiveMutation.mutateAsync(listingId);
      toast.success('Listing is now active');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to set listing as active');
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await markAsSoldMutation.mutateAsync(listingId);
      toast.success('Listing marked as sold');
      navigate('/profile');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark as sold');
    }
  };

  const handleHide = async () => {
    try {
      await hideMutation.mutateAsync(listingId);
      toast.success('Listing hidden');
      navigate('/profile');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to hide listing');
    }
  };

  const handleEdit = () => {
    navigate(`/items/${listingId}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setShowDeleteDialog(false);
    try {
      await deleteMutation.mutateAsync(listingId);
      toast.success('Listing deleted');
      navigate('/profile');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete listing');
    }
  };

  return {
    handleSetActive,
    handleMarkAsSold,
    handleHide,
    handleEdit,
    handleDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    confirmDelete,
  };
}
