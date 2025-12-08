import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserPostsPage } from './UserPostsPage';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock the hooks
vi.mock('../../users/hooks', () => ({
  useUser: vi.fn(),
}));

vi.mock('../hooks', () => ({
  useUserPosts: vi.fn(),
  useCreatePost: vi.fn(),
  useDeletePost: vi.fn(),
}));

// Mock the UI components
vi.mock('@web-developer-assignment/ui', () => ({
  Breadcrumb: ({ items }: { items: { label: string; href?: string }[] }) => (
    <nav data-testid="breadcrumb">
      {items.map((item, i) => (
        <span key={i}>{item.label}</span>
      ))}
    </nav>
  ),
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
  DeleteConfirmModal: ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) =>
    isOpen ? (
      <div data-testid="delete-modal">
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Confirm Delete</button>
      </div>
    ) : null,
  Modal: ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) =>
    isOpen ? (
      <div data-testid="modal">
        <button onClick={onClose} data-testid="close-modal">Close</button>
        {children}
      </div>
    ) : null,
}));

// Mock the components
vi.mock('../components', () => ({
  PostCard: ({ post, onDelete }: { post: { id: string; title: string }; onDelete: (id: string) => void }) => (
    <div data-testid={`post-card-${post.id}`}>
      <span>{post.title}</span>
      <button onClick={() => onDelete(post.id)} data-testid={`delete-${post.id}`}>Delete</button>
    </div>
  ),
  NewPostCard: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="new-post-card" onClick={onClick}>New Post</button>
  ),
}));

// Mock lazy-loaded PostForm
vi.mock('../components/PostForm/PostForm', () => ({
  PostForm: ({ onSubmit, onCancel }: { onSubmit: (data: { title: string; body: string }) => void; onCancel: () => void }) => (
    <form data-testid="post-form" onSubmit={(e) => { e.preventDefault(); onSubmit({ title: 'Test', body: 'Content' }); }}>
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  ),
}));

import { useUser } from '../../users/hooks';
import { useUserPosts, useCreatePost, useDeletePost } from '../hooks';

const mockUser = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipcode: '10001',
  },
};

const mockPosts = [
  { id: 'post1', userId: 'user1', title: 'First Post', body: 'First post content' },
  { id: 'post2', userId: 'user1', title: 'Second Post', body: 'Second post content' },
];

const renderWithRouter = (userId = 'user1') => {
  return render(
    <MemoryRouter initialEntries={[`/users/${userId}/posts`]}>
      <Routes>
        <Route path="/users/:userId/posts" element={<UserPostsPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('UserPostsPage', () => {
  const mockMutate = vi.fn();
  const mockDeleteMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useUser as Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
    });

    (useUserPosts as Mock).mockReturnValue({
      data: mockPosts,
      isLoading: false,
    });

    (useCreatePost as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    });

    (useDeletePost as Mock).mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when user is loading', () => {
      (useUser as Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      renderWithRouter();

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should show loading spinner when posts are loading', () => {
      (useUserPosts as Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      renderWithRouter();

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });

  describe('User Not Found', () => {
    it('should show not found message when user does not exist', () => {
      (useUser as Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      renderWithRouter();

      expect(screen.getByText('User not found.')).toBeInTheDocument();
    });

    it('should show breadcrumb with Not Found label', () => {
      (useUser as Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
      });

      renderWithRouter();

      expect(screen.getByText('Not Found')).toBeInTheDocument();
    });
  });

  describe('User Found', () => {
    it('should display user name', () => {
      renderWithRouter();

      expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
    });

    it('should display user email', () => {
      renderWithRouter();

      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should display post count', () => {
      renderWithRouter();

      expect(screen.getByText(/2 Posts/)).toBeInTheDocument();
    });

    it('should display singular "Post" when there is only one post', () => {
      (useUserPosts as Mock).mockReturnValue({
        data: [mockPosts[0]],
        isLoading: false,
      });

      renderWithRouter();

      expect(screen.getByText(/1 Post$/)).toBeInTheDocument();
    });

    it('should display breadcrumb with user name', () => {
      renderWithRouter();

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      // User name appears in both breadcrumb and heading, so just check breadcrumb exists
      expect(screen.getByTestId('breadcrumb')).toHaveTextContent('John Doe');
    });
  });

  describe('Posts Display', () => {
    it('should render new post card', () => {
      renderWithRouter();

      expect(screen.getByTestId('new-post-card')).toBeInTheDocument();
    });

    it('should render all posts', () => {
      renderWithRouter();

      expect(screen.getByTestId('post-card-post1')).toBeInTheDocument();
      expect(screen.getByTestId('post-card-post2')).toBeInTheDocument();
    });

    it('should display post titles', () => {
      renderWithRouter();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });

  describe('Create Post Modal', () => {
    it('should open modal when new post card is clicked', async () => {
      renderWithRouter();

      fireEvent.click(screen.getByTestId('new-post-card'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });

    it('should display modal title', async () => {
      renderWithRouter();

      fireEvent.click(screen.getByTestId('new-post-card'));

      await waitFor(() => {
        expect(screen.getByText('New post')).toBeInTheDocument();
      });
    });

    it('should close modal when close button is clicked', async () => {
      renderWithRouter();

      fireEvent.click(screen.getByTestId('new-post-card'));

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('close-modal'));

      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      });
    });

    it('should call createPost.mutate when form is submitted', async () => {
      renderWithRouter();

      fireEvent.click(screen.getByTestId('new-post-card'));

      await waitFor(() => {
        expect(screen.getByTestId('post-form')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Submit'));

      expect(mockMutate).toHaveBeenCalledWith(
        { title: 'Test', body: 'Content', userId: 'user1' },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      );
    });
  });

  describe('Delete Post', () => {
    it('should open delete modal when delete button is clicked', async () => {
      renderWithRouter();

      fireEvent.click(screen.getByTestId('delete-post1'));

      await waitFor(() => {
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
      });
    });

    it('should close delete modal when cancel is clicked', async () => {
      renderWithRouter();

      fireEvent.click(screen.getByTestId('delete-post1'));

      await waitFor(() => {
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
      });
    });

    it('should call deletePost.mutate when confirm is clicked', async () => {
      renderWithRouter();

      fireEvent.click(screen.getByTestId('delete-post1'));

      await waitFor(() => {
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Confirm Delete'));

      expect(mockDeleteMutate).toHaveBeenCalledWith(
        'post1',
        expect.objectContaining({ onSuccess: expect.any(Function) })
      );
    });
  });

  describe('Empty Posts', () => {
    it('should show 0 Posts when no posts exist', () => {
      (useUserPosts as Mock).mockReturnValue({
        data: [],
        isLoading: false,
      });

      renderWithRouter();

      expect(screen.getByText(/0 Posts/)).toBeInTheDocument();
    });

    it('should still show new post card when no posts exist', () => {
      (useUserPosts as Mock).mockReturnValue({
        data: [],
        isLoading: false,
      });

      renderWithRouter();

      expect(screen.getByTestId('new-post-card')).toBeInTheDocument();
    });
  });
});
