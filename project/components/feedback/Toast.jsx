import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Toast({ tone = 'neutral', children, actionLabel, onAction, onDismiss }) {
  return (
    <div className={'ecos-toast' + (tone === 'success' ? ' ecos-toast--success' : '')} role="status">
      <Icon name={tone === 'success' ? 'check-circle' : 'info'} />
      <div className="ecos-toast__body">{children}</div>
      {actionLabel && <button className="ecos-btn ecos-btn--ghost ecos-btn--sm" onClick={onAction}>{actionLabel}</button>}
      {onDismiss && <button className="ecos-btn ecos-btn--ghost ecos-btn--sm ecos-btn--icon" aria-label="Dismiss" onClick={onDismiss}><Icon name="x" /></button>}
    </div>
  );
}