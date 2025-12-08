import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmModal } from './DeleteConfirmModal';

describe('DeleteConfirmModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <DeleteConfirmModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.queryByText('Delete Post')).not.toBeInTheDocument();
  });

  it('should render with default title and message when isOpen is true', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText('Delete Post')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this post? This action cannot be undone.')
    ).toBeInTheDocument();
  });

  it('should render with custom title and message', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Remove Item"
        message="This item will be permanently removed."
      />
    );

    expect(screen.getByText('Remove Item')).toBeInTheDocument();
    expect(screen.getByText('This item will be permanently removed.')).toBeInTheDocument();
  });

  it('should render Cancel and Delete buttons', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should call onClose when clicking Cancel button', async () => {
    const user = userEvent.setup();
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await user.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm when clicking Delete button', async () => {
    const user = userEvent.setup();
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await user.click(screen.getByText('Delete'));

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should disable buttons when isLoading is true', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isLoading={true}
      />
    );

    expect(screen.getByText('Cancel')).toBeDisabled();
    // Delete button shows loading state, get by role
    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find(btn => btn.textContent?.includes('Deleting'));
    expect(deleteButton).toBeDisabled();
  });

  it('should show "Deleting..." text when isLoading is true', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isLoading={true}
      />
    );

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('should call onClose when clicking backdrop', async () => {
    const user = userEvent.setup();
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const backdrop = document.querySelector('.bg-black\\/50');
    await user.click(backdrop!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close on backdrop click when isLoading is true', async () => {
    const user = userEvent.setup();
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isLoading={true}
      />
    );

    const backdrop = document.querySelector('.bg-black\\/50');
    await user.click(backdrop!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
