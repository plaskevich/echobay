import { useNavigate } from 'react-router-dom';

import { useDeleteListing, useHideListing, useMarkListingAsSold, useSetListingActive } from '@/queries/useListings';

export function useListingActions(listingId: string) {
  const navigate = useNavigate();
  const markAsSoldMutation = useMarkListingAsSold();
  const hideMutation = useHideListing();
  const setActiveMutation = useSetListingActive();
  const deleteMutation = useDeleteListing();

  const handleSetActive = async () => {
    try {
      await setActiveMutation.mutateAsync(listingId);
      alert('Listing is now active');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to set listing as active');
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await markAsSoldMutation.mutateAsync(listingId);
      alert('Listing marked as sold');
      navigate('/profile');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to mark as sold');
    }
  };

  const handleHide = async () => {
    try {
      await hideMutation.mutateAsync(listingId);
      alert('Listing hidden');
      navigate('/profile');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to hide listing');
    }
  };

  const handleEdit = () => {
    navigate(`/items/${listingId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      await deleteMutation.mutateAsync(listingId);
      alert('Listing deleted');
      navigate('/profile');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete listing');
    }
  };

  return {
    handleSetActive,
    handleMarkAsSold,
    handleHide,
    handleEdit,
    handleDelete,
  };
}
