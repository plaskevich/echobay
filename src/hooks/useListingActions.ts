import { useNavigate } from 'react-router-dom';

import { useDeleteListing, useHideListing, useMarkListingAsSold } from '@/queries/useListings';

export function useListingActions(listingId: string) {
  const navigate = useNavigate();
  const markAsSoldMutation = useMarkListingAsSold();
  const hideMutation = useHideListing();
  const deleteMutation = useDeleteListing();

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
    handleMarkAsSold,
    handleHide,
    handleEdit,
    handleDelete,
  };
}
