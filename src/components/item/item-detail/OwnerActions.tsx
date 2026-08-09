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
      <Button variant="danger-outline" size="medium" fullWidth onClick={onDelete} data-testid="delete-listing-button">
        <i className="hn hn-trash-alt" />
        Delete Listing
      </Button>
    );
  }

  return (
    <>
      {status === 'active' && (
        <>
          <Button variant="primary" size="medium" fullWidth onClick={onMarkAsSold} data-testid="mark-sold-button">
            <i className="hn hn-tag" />
            Mark as Sold
          </Button>
          <Button variant="outline" size="medium" fullWidth onClick={onHide} data-testid="hide-listing-button">
            <i className="hn hn-eye-cross" />
            Hide Listing
          </Button>
        </>
      )}
      {status === 'hidden' && onSetActive && (
        <>
          <Button variant="primary" size="medium" fullWidth onClick={onSetActive} data-testid="set-active-button">
            <i className="hn hn-eye" />
            Set as Active
          </Button>
          <Button variant="outline" size="medium" fullWidth onClick={onMarkAsSold} data-testid="mark-sold-button">
            <i className="hn hn-tag" />
            Mark as Sold
          </Button>
        </>
      )}
      <Button variant="outline" size="medium" fullWidth onClick={onEdit} data-testid="edit-listing-button">
        <i className="hn hn-pen" />
        Edit Listing
      </Button>
      <Button variant="danger-outline" size="medium" fullWidth onClick={onDelete} data-testid="delete-listing-button">
        <i className="hn hn-trash-alt" />
        Delete Listing
      </Button>
    </>
  );
}
