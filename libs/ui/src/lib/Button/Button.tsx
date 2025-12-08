import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center font-medium transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 border border-transparent',
  {
    variants: {
      variant: {
        primary:
          'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:hover:bg-blue-600',
        secondary:
          'bg-white text-slate-950 border-slate-200 hover:bg-gray-50 active:bg-gray-100 disabled:hover:bg-white',
        danger:
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:hover:bg-red-600',
        ghost:
          'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200',
        link: 'bg-transparent text-blue-600 hover:text-blue-700 active:text-blue-800 hover:underline p-0 border-0',
      },
      size: {
        sm: 'px-4 py-2 text-xs rounded-md',
        md: 'px-6 py-2.5 text-sm rounded-lg',
        lg: 'px-8 py-3 text-base rounded-lg',
        icon: 'p-2 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={twMerge(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            {loadingText && <span className="ml-2">{loadingText}</span>}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export { buttonVariants };
