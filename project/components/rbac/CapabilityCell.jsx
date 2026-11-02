import React from 'react';
import { Icon } from '../core/Icon.jsx';
const ICON = { granted: 'check-bold', scoped: 'map-pin-simple', none: 'minus' };
const TIP = { granted: 'Granted', scoped: 'Granted within scope', none: 'Not granted' };
export function CapabilityCell({ state = 'none', delegable, onClick, label }) {
  const cls = ['ecos-cap', 'ecos-cap--' + state, delegable && state !== 'none' && 'ecos-cap--delegable'].filter(Boolean).join(' ');
  const t = (label ? label + ': ' : '') + TIP[state] + (delegable && state !== 'none' ? ' · can delegate' : '');
  return onClick
    ? <button type="button" className={cls} onClick={onClick} title={t} aria-label={t}><Icon name={ICON[state]} /></button>
    : <span className={cls} title={t} aria-label={t}><Icon name={ICON[state]} /></span>;
}