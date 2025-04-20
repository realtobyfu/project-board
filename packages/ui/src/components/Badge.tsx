import React from 'react';

export interface BadgeProps {
  text: string;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neon' | 'dark';
  variant?: 'solid' | 'outline' | 'minimal';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  color = 'primary',
  variant = 'solid',
  className = '',
}) => {
  const colorVariants = {
    primary: {
      solid: 'bg-midnight-100 text-midnight-800 border border-midnight-200',
      outline: 'bg-transparent border border-midnight-300 text-midnight-700',
      minimal: 'bg-transparent text-midnight-700',
    },
    secondary: {
      solid: 'bg-gray-100 text-gray-800 border border-gray-200',
      outline: 'bg-transparent border border-gray-300 text-gray-700',
      minimal: 'bg-transparent text-gray-700',
    },
    success: {
      solid: 'bg-green-100 text-green-800 border border-green-200',
      outline: 'bg-transparent border border-green-300 text-green-700',
      minimal: 'bg-transparent text-green-700',
    },
    danger: {
      solid: 'bg-red-100 text-red-800 border border-red-200',
      outline: 'bg-transparent border border-red-300 text-red-700',
      minimal: 'bg-transparent text-red-700',
    },
    warning: {
      solid: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      outline: 'bg-transparent border border-yellow-300 text-yellow-700',
      minimal: 'bg-transparent text-yellow-700',
    },
    info: {
      solid: 'bg-blue-100 text-blue-800 border border-blue-200',
      outline: 'bg-transparent border border-blue-300 text-blue-700',
      minimal: 'bg-transparent text-blue-700',
    },
    neon: {
      solid: 'bg-neon-100 text-neon-800 border border-neon-200',
      outline: 'bg-transparent border border-neon-400 text-neon-600',
      minimal: 'bg-transparent text-neon-600',
    },
    dark: {
      solid: 'bg-midnight-800 text-white border border-midnight-700',
      outline: 'bg-transparent border border-midnight-500 text-midnight-600',
      minimal: 'bg-transparent text-midnight-600',
    },
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${colorVariants[color][variant]} ${className}`}
    >
      {text}
    </span>
  );
};
