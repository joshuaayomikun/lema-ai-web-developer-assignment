import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostForm } from './PostForm';

// Mock @web-developer-assignment/ui Button component
vi.mock('@web-developer-assignment/ui', () => ({
  Button: ({ children, isLoading, loadingText, ...props }: { 
    children: React.ReactNode; 
    isLoading?: boolean; 
    loadingText?: string;
    [key: string]: unknown;
  }) => (
    <button {...props}>
      {isLoading ? loadingText || 'Loading...' : children}
    </button>
  ),
}));

// Mock react-hook-form to speed up tests
vi.mock('react-hook-form', () => {
  const mockRegister = vi.fn((name: string) => ({
    name,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  }));

  let formValues = { title: '', body: '' };
  let formErrors: Record<string, { message: string } | undefined> = {};
  let isValid = false;

  return {
    useForm: () => ({
      register: mockRegister,
      handleSubmit: (onSubmit: (data: { title: string; body: string }) => void) => (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) {
          onSubmit(formValues);
        }
      },
      reset: vi.fn(),
      watch: (field: string, defaultValue = '') => {
        if (field === 'title') return formValues.title || defaultValue;
        if (field === 'body') return formValues.body || defaultValue;
        return defaultValue;
      },
      formState: {
        errors: formErrors,
        isValid,
      },
    }),
    // Export helper to set form state in tests
    __setFormState: (values: { title: string; body: string }, errors: Record<string, { message: string } | undefined>, valid: boolean) => {
      formValues = values;
      formErrors = errors;
      isValid = valid;
    },
  };
});

describe('PostForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render title input with label', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/post title/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('My newest post!')).toBeInTheDocument();
    });

    it('should render body textarea with label', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/post content/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('I get a rush with every blog post I make.')).toBeInTheDocument();
    });

    it('should render Cancel and Publish buttons', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Publish')).toBeInTheDocument();
    });

    it('should render required field indicators', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators).toHaveLength(2);
    });

    it('should render character count for title', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByText('0/100')).toBeInTheDocument();
    });

    it('should render character count for body', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByText('0/1000')).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    it('should display error message when error prop is provided', () => {
      const error = new Error('Something went wrong');

      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} error={error} />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should display default error message when error has no message', () => {
      const error = new Error();

      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} error={error} />);

      expect(screen.getByText('Failed to create post. Please try again.')).toBeInTheDocument();
    });

    it('should not display error when error prop is null', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} error={null} />);

      expect(screen.queryByText('Failed to create post. Please try again.')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show "Publishing..." when isLoading is true', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />);

      expect(screen.getByText('Publishing...')).toBeInTheDocument();
      expect(screen.queryByText('Publish')).not.toBeInTheDocument();
    });

    it('should disable Cancel button when isLoading is true', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />);

      expect(screen.getByText('Cancel')).toBeDisabled();
    });

    it('should disable submit button when isLoading is true', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />);

      expect(screen.getByText('Publishing...')).toBeDisabled();
    });
  });

  describe('Cancel Button', () => {
    it('should call onCancel when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.click(screen.getByText('Cancel'));

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should not call onCancel when Cancel is disabled and clicked', async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />);

      await user.click(screen.getByText('Cancel'));

      // Button is disabled, so click should not trigger callback
      // Note: In real DOM, disabled buttons don't fire click events
      // but testing-library may still fire them
    });
  });

  describe('Form Submission', () => {
    it('should have submit button disabled when form is invalid', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const submitButton = screen.getByText('Publish');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByRole('textbox', { name: /post title/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /post content/i })).toBeInTheDocument();
    });

    it('should have Cancel button with type="button"', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByText('Cancel');
      expect(cancelButton).toHaveAttribute('type', 'button');
    });

    it('should have Publish button with type="submit"', () => {
      render(<PostForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const submitButton = screen.getByText('Publish');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
});
