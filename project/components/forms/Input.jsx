import React from 'react';
export function Input({ size = 'md', mono, invalid, className, ...rest }) {
  return <input aria-invalid={invalid || undefined} className={['ecos-input', mono && 'ecos-input--mono', size === 'lg' && 'ecos-input--lg', className].filter(Boolean).join(' ')} {...rest} />;
}