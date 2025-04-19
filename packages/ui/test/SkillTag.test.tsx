import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SkillTag } from '../src/components/SkillTag';

describe('SkillTag', () => {
  it('renders the skill text', () => {
    render(<SkillTag skill="React" />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<SkillTag skill="React" onRemove={onRemove} />);
    
    const removeButton = screen.getByRole('button', { name: /remove react/i });
    fireEvent.click(removeButton);
    
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does not show remove button when onRemove is not provided', () => {
    render(<SkillTag skill="React" />);
    
    const removeButton = screen.queryByRole('button', { name: /remove react/i });
    expect(removeButton).not.toBeInTheDocument();
  });
}); 