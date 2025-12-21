import { IoCheckmarkCircle, IoCreate, IoEyeOff, IoTrash } from 'react-icons/io5';

import { Button } from '@/components/common/Button';

interface OwnerActionsProps {
  onMarkAsSold: () => void;
  onHide: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function OwnerActions({ onMarkAsSold, onHide, onEdit, onDelete }: OwnerActionsProps) {
  return (
    <>
      <Button variant="primary" size="medium" fullWidth onClick={onMarkAsSold}>
        <IoCheckmarkCircle size={20} />
        Mark as Sold
      </Button>
      <Button variant="outline" size="medium" fullWidth onClick={onHide}>
        <IoEyeOff size={20} />
        Hide Listing
      </Button>
      <Button variant="outline" size="medium" fullWidth onClick={onEdit}>
        <IoCreate size={20} />
        Edit Lisitng
      </Button>
      <Button variant="danger-outline" size="medium" fullWidth onClick={onDelete}>
        <IoTrash size={20} />
        Delete Listing
      </Button>
    </>
  );
}
