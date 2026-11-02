import React from 'react';
export function Card({ kicker, title, children, meta, interactive, selected, inverse, onClick, style }) {
  return (
    <div onClick={onClick} style={style} tabIndex={interactive ? 0 : undefined}
      className={['ecos-card', interactive && 'ecos-card--interactive', selected && 'ecos-card--selected', inverse && 'ecos-card--inverse'].filter(Boolean).join(' ')}>
      {kicker && <div className="ecos-card__kicker">{kicker}</div>}
      {title && <div className="ecos-card__title">{title}</div>}
      {children}
      {meta && <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{meta}</div>}
    </div>
  );
}