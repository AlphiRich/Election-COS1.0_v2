import React from 'react';
export function StatusBadge({ status = 'neutral', dot = true, children }) {
  return <span className={['ecos-badge', 'ecos-badge--' + status, !dot && 'ecos-badge--nodot'].filter(Boolean).join(' ')}>{children}</span>;
}