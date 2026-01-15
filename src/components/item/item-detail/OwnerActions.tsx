import { PiCheckCircleDuotone, PiEyeSlashDuotone, PiPencilSimpleLineDuotone, PiTrashDuotone } from 'react-icons/pi';

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
        <PiCheckCircleDuotone size={20} />
        Mark as Sold
      </Button>
      <Button variant="outline" size="medium" fullWidth onClick={onHide}>
        <PiEyeSlashDuotone size={20} />
        Hide Listing
      </Button>
      <Button variant="outline" size="medium" fullWidth onClick={onEdit}>
        <PiPencilSimpleLineDuotone size={20} />
        Edit Listing
      </Button>
      <Button variant="danger-outline" size="medium" fullWidth onClick={onDelete}>
        <PiTrashDuotone size={20} />
        Delete Listing
      </Button>
    </>
  );
}
