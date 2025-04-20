import React from 'react';
import { Badge, BadgeProps } from './Badge';

export interface SkillTagProps extends Omit<BadgeProps, 'text'> {
  skill: string;
  onRemove?: () => void;
}

export const SkillTag: React.FC<SkillTagProps> = ({ skill, onRemove, ...badgeProps }) => {
  return (
    <div className="inline-flex items-center mr-2 mb-2 group">
      <Badge
        text={skill}
        color={badgeProps.color || 'neon'}
        variant={badgeProps.variant || 'solid'}
        className={`${onRemove ? 'pr-6' : ''} transition-all duration-200 ${badgeProps.className || ''}`}
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-midnight-400 hover:text-midnight-600 group-hover:bg-neon-200 transition-all duration-200 focus:outline-none"
          aria-label={`Remove ${skill}`}
        >
          <span className="sr-only">Remove {skill}</span>
          <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" viewBox="0 0 8 8">
            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
          </svg>
        </button>
      )}
    </div>
  );
};
