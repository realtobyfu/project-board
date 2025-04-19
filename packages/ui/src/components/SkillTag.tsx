import React from 'react';
import { Badge, BadgeProps } from './Badge';

export interface SkillTagProps extends Omit<BadgeProps, 'text'> {
  skill: string;
  onRemove?: () => void;
}

export const SkillTag: React.FC<SkillTagProps> = ({ skill, onRemove, ...badgeProps }) => {
  return (
    <div className="inline-flex items-center mr-2 mb-2">
      <Badge text={skill} color="primary" {...badgeProps} />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
        >
          <span className="sr-only">Remove {skill}</span>
          <svg
            className="h-2 w-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 8 8"
          >
            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
          </svg>
        </button>
      )}
    </div>
  );
}; 