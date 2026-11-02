import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Dialog({ open = true, title, kicker, children, actions, onClose, width, inline }) {
  if (!open) return null;
  const box = (
    <div className="ecos-dialog" role="dialog" aria-modal="true" style={width ? { maxWidth: width } : undefined}>
      <div className="ecos-dialog__head">
        <div>{kicker && <div className="ecos-label" style={{ marginBottom: 6 }}>{kicker}</div>}<div className="ecos-dialog__title">{title}</div></div>
        {onClose && <button className="ecos-btn ecos-btn--ghost ecos-btn--icon ecos-btn--sm" aria-label="Close" onClick={onClose}><Icon name="x" /></button>}
      </div>
      <div className="ecos-dialog__body">{children}</div>
      {actions && <div className="ecos-dialog__actions">{actions}</div>}
    </div>
  );
  if (inline) return box;
  return <div className="ecos-dialog-backdrop" onClick={e => { if (e.target === e.currentTarget && onClose) onClose(); }}>{box}</div>;
}