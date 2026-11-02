import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Wordmark } from '../core/Wordmark.jsx';
export function SideNav({ sections = [], value, onChange, footer, style }) {
  return (
    <nav className="ecos-sidenav ecos-inverse" style={style}>
      <div style={{ padding: '8px 12px 4px' }}><Wordmark inverse /></div>
      {sections.map((s, i) => (
        <React.Fragment key={i}>
          {s.title && <div className="ecos-sidenav__section">{s.title}</div>}
          {s.items.map(it => (
            <button key={it.value} className="ecos-sidenav__item" aria-current={it.value === value ? 'page' : undefined} onClick={() => onChange && onChange(it.value)}>
              {it.icon && <Icon name={it.icon} />}<span>{it.label}</span>{it.meta && <span className="ecos-sidenav__meta">{it.meta}</span>}
            </button>
          ))}
        </React.Fragment>
      ))}
      {footer && <div style={{ marginTop: 'auto', padding: '16px 12px 4px' }}>{footer}</div>}
    </nav>
  );
}