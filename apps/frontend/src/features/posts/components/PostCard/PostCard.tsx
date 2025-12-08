import { Post } from '../../types';
import { useEffect, useRef, useState } from 'react';

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineClamp, setLineClamp] = useState(10);

  useEffect(() => {
    if (titleRef.current && containerRef.current) {
      const titleHeight = titleRef.current.offsetHeight;
      const containerHeight = containerRef.current.offsetHeight;
      const padding = 16; // p-4 = 16px top + 16px bottom
      const titleMargin = 8; // mb-2 = 8px
      
      // Available height for content
      const availableHeight = containerHeight - padding - titleHeight - titleMargin;
      
      // Calculate line height (leading-relaxed = 1.625, text-sm = 14px)
      const lineHeight = 14 * 1.625; // ≈ 22.75px
      
      // Calculate number of lines that fit
      const calculatedLines = Math.floor(availableHeight / lineHeight);
      
      // Clamp between 7 and 12 (our custom Tailwind utilities)
      setLineClamp(Math.max(7, Math.min(12, calculatedLines)));
    }
  }, [post.title]);

  return (
    <div ref={containerRef} className="border border-slate-200 rounded-lg p-4 bg-white relative w-full sm:w-card h-card flex flex-col shadow-(--shadow-card) animate-fade-in">
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

      <h3 ref={titleRef} className="text-base font-semibold text-gray-900 mb-2 pr-6 line-clamp-2 text-pretty" title={post.title}>
        {post.title}
      </h3>

      <p 
        className={`text-sm text-gray-600 leading-relaxed flex-1 text-pretty line-clamp-${lineClamp}`}
      >
        {post.body}
      </p>
    </div>
  );
}
