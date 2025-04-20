import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-midnight-700 mb-1">
          {label}
          {required && <span className="text-neon-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`block w-full px-3 py-2 border ${
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-neon-500'
        } rounded-xl shadow-sm focus:outline-none focus:border-transparent focus:ring-2 transition-all duration-200`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
