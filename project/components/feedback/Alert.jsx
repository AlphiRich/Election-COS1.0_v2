import React from 'react';
import { Icon } from '../core/Icon.jsx';
const ICONS = { info: 'info', success: 'check-circle', warning: 'warning', critical: 'shield-warning' };
export function Alert({ tone = 'info', title, children, action, icon }) {
  return (
    <div className={'ecos-alert ecos-alert--' + tone} role={tone === 'critical' || tone === 'warning' ? 'alert' : 'status'}>
      <Icon name={icon || ICONS[tone]} />
      <div>{title && <div className="ecos-alert__title">{title}</div>}{children && <div>{children}</div>}</div>
      {action || <span />}
    </div>
  );
}