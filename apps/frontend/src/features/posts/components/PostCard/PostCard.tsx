import { Post } from '../../types';

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white relative w-full sm:w-card h-card flex flex-col shadow-(--shadow-card) animate-fade-in">
      <button
        onClick={() => onDelete(post.id)}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        aria-label="Delete post"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>

      <h3 className="text-base font-semibold text-gray-900 mb-2 pr-6 line-clamp-2" title={post.title}>
        {post.title}
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">
        {post.body}
      </p>
    </div>
  );
}
