import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Field({ label, hint, error, htmlFor, children, style }) {
  return (
    <div className="ecos-field" style={style}>
      {label && <label className="ecos-field__label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {error ? <div className="ecos-field__error"><Icon name="warning" />{error}</div> : hint && <div className="ecos-field__hint">{hint}</div>}
    </div>
  );
}