import { useNavigate } from '@tanstack/react-router';

import { supabase } from '@/lib/supabase';

export function useListingActions(listingId: string) {
  const navigate = useNavigate();

  const handleMarkAsSold = async () => {
    try {
      const { error } = await supabase.from('listings').update({ status: 'sold' }).eq('id', listingId);

      if (error) throw error;
      alert('Listing marked as sold');
      navigate({ to: '/catalog' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to mark as sold');
    }
  };

  const handleHide = async () => {
    try {
      const { error } = await supabase.from('listings').update({ status: 'hidden' }).eq('id', listingId);

      if (error) throw error;
      alert('Listing hidden');
      navigate({ to: '/catalog' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to hide listing');
    }
  };

  const handleEdit = () => {
    navigate({ to: `/items/${listingId}/edit` });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const { error } = await supabase.from('listings').delete().eq('id', listingId);

      if (error) throw error;
      alert('Listing deleted');
      navigate({ to: '/catalog' });
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
