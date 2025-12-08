import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useUser } from '../../users/hooks';
import { useUserPosts, useCreatePost, useDeletePost } from '../hooks';
import toast from 'react-hot-toast';
import { Breadcrumb, LoadingSpinner, DeleteConfirmModal, Modal } from '@web-developer-assignment/ui';
import { PostCard, NewPostCard } from '../components';

// Lazy load the PostForm
const PostForm = lazy(() => import('../components/PostForm/PostForm').then(m => ({ default: m.PostForm })));

export function UserPostsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const userIdStr = userId || '';
  const fromPage = searchParams.get('fromPage');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; postId: string | null }>({
    isOpen: false,
    postId: null,
  });
  const newPostCardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: user, isLoading: isLoadingUser } = useUser(userIdStr);
  const { data: posts, isLoading: isLoadingPosts } = useUserPosts(userIdStr);
  const createPost = useCreatePost();
  const deletePost = useDeletePost();

  useEffect(() => {
    const newPostCard = newPostCardRef.current;
    const scrollContainer = scrollContainerRef.current;

    if (!newPostCard || !scrollContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingButton(!entry.isIntersecting);
      },
      { 
        root: scrollContainer,
        threshold: 0,
        rootMargin: '0px'
      }
    );

    observer.observe(newPostCard);

    return () => observer.disconnect();
  }, [user, posts]);

  const handleCreatePost = (data: { title: string; body: string }) => {
    createPost.mutate(
      { ...data, userId: userIdStr },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success('Post published successfully');
        },
      }
    );
  };

  const handleDeletePost = (postId: string) => {
    setDeleteModalState({ isOpen: true, postId });
  };

  const confirmDelete = () => {
    if (deleteModalState.postId) {
      deletePost.mutate(deleteModalState.postId, {
        onSuccess: () => {
          setDeleteModalState({ isOpen: false, postId: null });
          toast.success('Post deleted successfully');
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModalState({ isOpen: false, postId: null });
  };

  const breadcrumbItems = [
    { label: 'Users', href: fromPage ? `/?page=${fromPage}` : '/' },
    { label: user?.name || 'Loading...' },
  ];

  if (isLoadingUser || isLoadingPosts) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12">
        <Breadcrumb items={[{ label: 'Users', href: '/' }, { label: 'Not Found' }]} />
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">User not found.</p>
        </div>
      </div>
    );
  }

  const postCount = posts?.length || 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden gap-11">
      {/* Fixed Header */}
      <div className="shrink-0 pt-12 flex flex-col gap-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-medium text-gray-900 leading-10">{user.name}</h1>
          <p>
            <span className="text-gray-900">{user.email}</span>
            <span className="text-text-primary"> • {postCount} {postCount === 1 ? 'Post' : 'Posts'}</span>
          </p>
        </div>
      </div>

      {/* Scrollable Posts Section */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 -mr-2 pr-2">
        <div className="pb-12">
          <div className="flex flex-wrap gap-card-gap">
            <div ref={newPostCardRef}>
              <NewPostCard onClick={() => setIsModalOpen(true)} />
            </div>

            {posts?.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating New Post Button */}
      {showFloatingButton && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center z-40 cursor-pointer"
          aria-label="New Post"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
        <h2 className="text-3xl font-bold text-slate-950 mb-6">New post</h2>
        <Suspense fallback={<div className="flex justify-center py-8"><LoadingSpinner /></div>}>
          <PostForm
            onSubmit={handleCreatePost}
            onCancel={() => setIsModalOpen(false)}
            isLoading={createPost.isPending}
            error={createPost.error}
            shouldReset={!isModalOpen}
          />
        </Suspense>
      </Modal>

      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={deletePost.isPending}
      />
    </div>
  );
}
