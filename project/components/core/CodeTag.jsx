import React from 'react';
export function CodeTag({ children, plain, inverse, title }) {
  return <code title={title} className={['ecos-code', plain && 'ecos-code--plain', inverse && 'ecos-code--inverse'].filter(Boolean).join(' ')}>{children}</code>;
}