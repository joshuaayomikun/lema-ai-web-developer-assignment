import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostCard } from './PostCard';
import { Post } from '../../types';

describe('PostCard', () => {
  const mockPost: Post = {
    id: '1',
    userId: 'user1',
    title: 'Test Post Title',
    body: 'This is the body of the test post. It contains some sample content.',
  };

  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the post title', () => {
    render(<PostCard post={mockPost} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('should render the post body', () => {
    render(<PostCard post={mockPost} onDelete={mockOnDelete} />);

    expect(
      screen.getByText(
        'This is the body of the test post. It contains some sample content.'
      )
    ).toBeInTheDocument();
  });

  it('should render delete button with trash icon', () => {
    render(<PostCard post={mockPost} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete post/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete with post id when delete button is clicked', () => {
    render(<PostCard post={mockPost} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete post/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should truncate long body text', () => {
    const longPost: Post = {
      ...mockPost,
      body: 'A'.repeat(500),
    };

    render(<PostCard post={longPost} onDelete={mockOnDelete} />);

    const bodyElement = screen.getByText('A'.repeat(500));
    expect(bodyElement).toHaveClass('line-clamp-6');
  });

  it('should have fixed dimensions for card', () => {
    const { container } = render(
      <PostCard post={mockPost} onDelete={mockOnDelete} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('w-(--width-card)');
    expect(card).toHaveClass('h-(--height-card)');
  });
});
