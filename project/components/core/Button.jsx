import React from 'react';
import { Icon } from './Icon.jsx';
const cx = (...a) => a.filter(Boolean).join(' ');
export function Button({ variant = 'primary', size = 'md', icon, iconRight, block, disabled, children, type = 'button', onClick, className, style, ...rest }) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={style}
      className={cx('ecos-btn', 'ecos-btn--' + variant, size !== 'md' && 'ecos-btn--' + size, block && 'ecos-btn--block', className)} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
      {iconRight && <Icon name={iconRight} />}
    </button>
  );
}