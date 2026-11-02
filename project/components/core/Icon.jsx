import React from 'react';
/** Phosphor duotone glyph. name = Phosphor icon name without prefix, e.g. "shield-check". */
export function Icon({ name, size, label, style, className }) {
  return <i className={['ph-duotone', 'ph-' + name, 'ecos-icon', className].filter(Boolean).join(' ')} style={{ fontSize: size, ...style }} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}