import {
  PiCheckCircleDuotone,
  PiEyeDuotone,
  PiEyeSlashDuotone,
  PiPencilSimpleLineDuotone,
  PiTrashDuotone,
} from 'react-icons/pi';

import type { ListingStatus } from '@/api/listings';
import { Button } from '@/components/common/Button';

interface OwnerActionsProps {
  status?: ListingStatus;
  onSetActive?: () => void;
  onMarkAsSold: () => void;
  onHide: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function OwnerActions({
  status = 'active',
  onSetActive,
  onMarkAsSold,
  onHide,
  onEdit,
  onDelete,
}: OwnerActionsProps) {
  if (status === 'sold') {
    return (
      <Button variant="danger-outline" size="medium" fullWidth onClick={onDelete}>
        <PiTrashDuotone size={20} />
        Delete Listing
      </Button>
    );
  }

  return (
    <>
      {status === 'active' && (
        <>
          <Button variant="primary" size="medium" fullWidth onClick={onMarkAsSold}>
            <PiCheckCircleDuotone size={20} />
            Mark as Sold
          </Button>
          <Button variant="outline" size="medium" fullWidth onClick={onHide}>
            <PiEyeSlashDuotone size={20} />
            Hide Listing
          </Button>
        </>
      )}
      {status === 'hidden' && onSetActive && (
        <>
          <Button variant="primary" size="medium" fullWidth onClick={onSetActive}>
            <PiEyeDuotone size={20} />
            Set as Active
          </Button>
          <Button variant="outline" size="medium" fullWidth onClick={onMarkAsSold}>
            <PiCheckCircleDuotone size={20} />
            Mark as Sold
          </Button>
        </>
      )}
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
