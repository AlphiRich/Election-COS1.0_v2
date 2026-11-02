import React from 'react';
export function Select({ options = [], size = 'md', className, ...rest }) {
  return (
    <select className={['ecos-select', size === 'lg' && 'ecos-select--lg', className].filter(Boolean).join(' ')} {...rest}>
      {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
    </select>
  );
}