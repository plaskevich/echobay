import { Button } from '@/components/common/Button';
import { ButtonGroup } from '@/components/common/Form';
import { ErrorMessage } from '@/components/common/Message';

interface FormActionsProps {
  error: string | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function FormActions({ error, isSubmitting, onCancel }: FormActionsProps) {
  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ButtonGroup>
        <Button onClick={onCancel} type="button" variant="outline" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button isLoading={isSubmitting} type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
        </Button>
      </ButtonGroup>
    </>
  );
}
