import { Button } from '@/components/common/Button';
import { ButtonGroup } from '@/components/common/Form';
import { ErrorMessage } from '@/components/common/Message';

interface FormActionsProps {
  error: string | null;
  isSubmitting: boolean;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export function FormActions({ error, isSubmitting, onCancel, mode }: FormActionsProps) {
  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ButtonGroup>
        <Button
          onClick={onCancel}
          type="button"
          variant="outline"
          disabled={isSubmitting}
          data-testid="listing-cancel-button"
        >
          Cancel
        </Button>
        <Button
          isLoading={isSubmitting}
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          data-testid="listing-submit-button"
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Creating Listing...'
              : 'Saving Changes...'
            : mode === 'create'
              ? 'Create Listing'
              : 'Save Changes'}
        </Button>
      </ButtonGroup>
    </>
  );
}
