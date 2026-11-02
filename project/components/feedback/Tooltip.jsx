import React from 'react';
export function Tooltip({ tip, open, children }) {
  return <span className={'ecos-tooltip' + (open ? ' ecos-tooltip--open' : '')}>{children}<span role="tooltip" className="ecos-tooltip__tip">{tip}</span></span>;
}