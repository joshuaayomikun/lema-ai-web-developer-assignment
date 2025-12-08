interface NewPostCardProps {
  onClick: () => void;
}

export function NewPostCard({ onClick }: NewPostCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full h-full border border-dashed border-slate-200 rounded-lg p-4 bg-white flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-500"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
      <span className="text-sm text-gray-700 font-medium">New Post</span>
    </button>
  );
}
