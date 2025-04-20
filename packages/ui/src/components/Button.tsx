import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'neon' | 'dark' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  icon,
  ...props
}) => {
  const variantClasses = {
    primary:
      'bg-midnight-800 hover:bg-midnight-900 text-white shadow-md hover:shadow-lg transition-all duration-200',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-midnight-800 shadow-sm hover:shadow-md transition-all duration-200',
    outline:
      'bg-white border-2 border-midnight-300 hover:border-midnight-400 text-midnight-800 hover:bg-midnight-50 transition-all duration-200',
    neon: 'bg-neon-400 hover:bg-neon-500 text-midnight-900 shadow-neon hover:shadow-lg transition-all duration-200 font-medium',
    dark: 'bg-midnight-800 hover:bg-midnight-900 text-white shadow-md hover:shadow-lg transition-all duration-200 border border-midnight-700',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm rounded-xl',
    md: 'px-4 py-2 rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-xl',
  };

  const baseClasses =
    'inline-flex items-center justify-center font-medium focus:outline-none transform hover:-translate-y-0.5';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
