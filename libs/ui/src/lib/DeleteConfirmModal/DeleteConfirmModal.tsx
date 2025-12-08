import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Post',
  message = 'Are you sure you want to delete this post? This action cannot be undone.',
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" closeOnBackdropClick={!isLoading}>
      <h2 className="text-2xl font-bold text-slate-950 mb-4">{title}</h2>
      <p className="text-slate-600 mb-8">{message}</p>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          disabled={isLoading}
          isLoading={isLoading}
          loadingText="Deleting..."
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
