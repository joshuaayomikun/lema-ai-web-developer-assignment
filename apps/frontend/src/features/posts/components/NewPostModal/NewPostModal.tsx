import { useState, useEffect } from 'react';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; body: string }) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function NewPostModal({ isOpen, onClose, onSubmit, isLoading, error }: NewPostModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [touched, setTouched] = useState({ title: false, body: false });

  // Clear form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setBody('');
      setTouched({ title: false, body: false });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const titleError = touched.title && !title.trim() ? 'Title is required' : '';
  const bodyError = touched.body && !body.trim() ? 'Content is required' : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, body: true });
    
    if (title.trim() && body.trim()) {
      onSubmit({ title: title.trim(), body: body.trim() });
    }
  };

  const handleClose = () => {
    setTitle('');
    setBody('');
    setTouched({ title: false, body: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 p-8">
        <h2 className="text-3xl font-bold text-slate-950 mb-6">New post</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              {error.message || 'Failed to create post. Please try again.'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-950 mb-2"
            >
              Post title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-950 ${
                titleError ? 'border-red-500' : 'border-slate-200'
              }`}
              placeholder="My newest post!"
              required
            />
            {titleError && (
              <p className="mt-1 text-sm text-red-500">{titleError}</p>
            )}
          </div>

          <div className="mb-8">
            <label
              htmlFor="body"
              className="block text-sm font-medium text-slate-950 mb-2"
            >
              Post content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, body: true }))}
              rows={8}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-950 resize-y ${
                bodyError ? 'border-red-500' : 'border-slate-200'
              }`}
              placeholder="I get a rush with every blog post I make."
              required
            />
            {bodyError && (
              <p className="mt-1 text-sm text-red-500">{bodyError}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-medium text-slate-950 bg-white border border-slate-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !title.trim() || !body.trim()}
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
