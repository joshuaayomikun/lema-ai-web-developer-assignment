import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
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

  it('should call onDelete with post id when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete post/i });
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should truncate long body text', () => {
    const longPost: Post = {
      ...mockPost,
      body: 'A'.repeat(500),
    };

    render(<PostCard post={longPost} onDelete={mockOnDelete} />);

    const bodyElement = screen.getByText('A'.repeat(500));
    // Should have one of our custom line-clamp classes (7-12)
    const hasLineClamp = ['line-clamp-7', 'line-clamp-8', 'line-clamp-9', 'line-clamp-10', 'line-clamp-11', 'line-clamp-12']
      .some(className => bodyElement.className.includes(className));
    expect(hasLineClamp).toBe(true);
  });

  it('should apply text-pretty for better text wrapping', () => {
    render(<PostCard post={mockPost} onDelete={mockOnDelete} />);

    const titleElement = screen.getByText('Test Post Title');
    const bodyElement = screen.getByText('This is the body of the test post. It contains some sample content.');
    
    expect(titleElement).toHaveClass('text-pretty');
    expect(bodyElement).toHaveClass('text-pretty');
  });

  it('should have responsive dimensions for card', () => {
    const { container } = render(
      <PostCard post={mockPost} onDelete={mockOnDelete} />
    );

    const card = container.firstChild as HTMLElement;
    // Full width on mobile, fixed width on larger screens
    expect(card).toHaveClass('w-full');
    expect(card).toHaveClass('sm:w-card');
    expect(card).toHaveClass('h-card');
  });

  it('should have flex-1 on body text for proper height filling', () => {
    render(<PostCard post={mockPost} onDelete={mockOnDelete} />);

    const bodyElement = screen.getByText('This is the body of the test post. It contains some sample content.');
    expect(bodyElement).toHaveClass('flex-1');
  });
});
