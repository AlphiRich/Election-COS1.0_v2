import React from 'react';
export function Tabs({ tabs = [], value, onChange, style }) {
  return (
    <div className="ecos-tabs" role="tablist" style={style}>
      {tabs.map(t => (
        <button key={t.value} role="tab" className="ecos-tab" aria-selected={t.value === value} onClick={() => onChange && onChange(t.value)}>
          {t.label}{t.count != null && <span className="ecos-tab__count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}