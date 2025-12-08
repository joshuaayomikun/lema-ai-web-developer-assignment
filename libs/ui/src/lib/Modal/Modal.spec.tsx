import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should render children when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should call onClose when clicking backdrop', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    // Click the backdrop (the first div with bg-black/50 class)
    const backdrop = document.querySelector('.bg-black\\/50');
    fireEvent.click(backdrop!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when clicking backdrop if closeOnBackdropClick is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} closeOnBackdropClick={false}>
        <p>Modal content</p>
      </Modal>
    );

    const backdrop = document.querySelector('.bg-black\\/50');
    fireEvent.click(backdrop!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should not call onClose when clicking modal content', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    fireEvent.click(screen.getByText('Modal content'));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should apply correct maxWidth class for sm', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} maxWidth="sm">
        <p>Modal content</p>
      </Modal>
    );

    const modalContainer = screen.getByText('Modal content').parentElement;
    expect(modalContainer).toHaveClass('max-w-sm');
  });

  it('should apply correct maxWidth class for md (default)', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );

    const modalContainer = screen.getByText('Modal content').parentElement;
    expect(modalContainer).toHaveClass('max-w-md');
  });

  it('should apply correct maxWidth class for 2xl', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} maxWidth="2xl">
        <p>Modal content</p>
      </Modal>
    );

    const modalContainer = screen.getByText('Modal content').parentElement;
    expect(modalContainer).toHaveClass('max-w-2xl');
  });

  it('should render with proper accessibility structure', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <h2>Modal Title</h2>
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });
});
