import React from 'react';
export function AppBar({ title, crumbs = [], right, style }) {
  return (
    <header className="ecos-appbar" style={style}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0, flex: 1 }}>
        {crumbs.map((c, i) => <React.Fragment key={i}><span style={{ fontSize: 14, color: 'var(--slate)', whiteSpace: 'nowrap', flex: 'none' }}>{c}</span><span style={{ color: 'var(--line-strong)', flex: 'none' }}>/</span></React.Fragment>)}
        <span style={{ font: '600 14px/1.4 var(--font-body)', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{title}</span>
      </div>
      {right && <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 'none' }}>{right}</div>}
    </header>
  );
}