import React from 'react';
import { Icon } from './Icon.jsx';
export function IconButton({ icon, label, variant = 'ghost', size = 'md', onClick, disabled, className, style }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} style={style}
      className={['ecos-btn', 'ecos-btn--icon', 'ecos-btn--' + variant, size !== 'md' && 'ecos-btn--' + size, className].filter(Boolean).join(' ')}>
      <Icon name={icon} />
    </button>
  );
}