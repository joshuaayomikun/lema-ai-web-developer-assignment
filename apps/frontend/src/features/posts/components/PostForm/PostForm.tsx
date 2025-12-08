import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@web-developer-assignment/ui';

const TITLE_MAX_LENGTH = 100;
const BODY_MAX_LENGTH = 1000;

export interface PostFormData {
  title: string;
  body: string;
}

interface PostFormProps {
  onSubmit: (data: PostFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
  shouldReset?: boolean;
}

export function PostForm({ onSubmit, onCancel, isLoading, error, shouldReset }: PostFormProps) {
  // Track if fields have ever been modified (persists even when cleared back to empty)
  const hasBeenModified = useRef({ title: false, body: false });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<PostFormData>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      body: '',
    },
  });

  const titleValue = watch('title', '');
  const bodyValue = watch('body', '');

  // Track if user has ever typed in the field
  useEffect(() => {
    if (titleValue.length > 0) {
      hasBeenModified.current.title = true;
    }
  }, [titleValue]);

  useEffect(() => {
    if (bodyValue.length > 0) {
      hasBeenModified.current.body = true;
    }
  }, [bodyValue]);

  // Show error if field has been touched, modified at some point, and has an error
  const showTitleError = errors.title && touchedFields.title && hasBeenModified.current.title;
  const showBodyError = errors.body && touchedFields.body && hasBeenModified.current.body;

  // Reset form when shouldReset changes to true
  useEffect(() => {
    if (shouldReset) {
      hasBeenModified.current = { title: false, body: false };
      reset();
    }
  }, [shouldReset, reset]);

  const onFormSubmit = (data: PostFormData) => {
    onSubmit({ title: data.title.trim(), body: data.body.trim() });
  };

  const handleCancel = () => {
    hasBeenModified.current = { title: false, body: false };
    reset();
    onCancel();
  };

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            {error.message || 'Failed to create post. Please try again.'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
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
            {...register('title', {
              required: 'Title is required',
              maxLength: {
                value: TITLE_MAX_LENGTH,
                message: `Title must be ${TITLE_MAX_LENGTH} characters or less`,
              },
              validate: (value) => value.trim().length > 0 || 'Title is required',
            })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-950 ${
              showTitleError ? 'border-red-500' : 'border-slate-200'
            }`}
            placeholder="My newest post!"
          />
          <div className="flex justify-between mt-1">
            {showTitleError ? (
              <p className="text-sm text-red-500">{errors.title?.message}</p>
            ) : (
              <span />
            )}
            <span className={`text-sm ${titleValue.length > TITLE_MAX_LENGTH ? 'text-red-500' : 'text-slate-400'}`}>
              {titleValue.length}/{TITLE_MAX_LENGTH}
            </span>
          </div>
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
            {...register('body', {
              required: 'Content is required',
              maxLength: {
                value: BODY_MAX_LENGTH,
                message: `Content must be ${BODY_MAX_LENGTH} characters or less`,
              },
              validate: (value) => value.trim().length > 0 || 'Content is required',
            })}
            rows={8}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-950 resize-none ${
              showBodyError ? 'border-red-500' : 'border-slate-200'
            }`}
            placeholder="I get a rush with every blog post I make."
          />
          <div className="flex justify-between mt-1">
            {showBodyError ? (
              <p className="text-sm text-red-500">{errors.body?.message}</p>
            ) : (
              <span />
            )}
            <span className={`text-sm ${bodyValue.length > BODY_MAX_LENGTH ? 'text-red-500' : 'text-slate-400'}`}>
              {bodyValue.length}/{BODY_MAX_LENGTH}
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !isValid}
            isLoading={isLoading}
            loadingText="Publishing..."
          >
            Publish
          </Button>
        </div>
      </form>
    </>
  );
}
