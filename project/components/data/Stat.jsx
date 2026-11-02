import React from 'react';
export function Stat({ label, value, delta, style }) {
  return (
    <div className="ecos-stat" style={style}>
      <div className="ecos-label">{label}</div>
      <div className="ecos-stat__value">{value}</div>
      {delta && <div className="ecos-stat__delta">{delta}</div>}
    </div>
  );
}