import React from 'react';
export function Table({ columns = [], rows = [], dense, rowKey, onRowClick }) {
  return (
    <table className={'ecos-table' + (dense ? ' ecos-table--dense' : '')}>
      <thead><tr>{columns.map(c => <th key={c.key} className={c.numeric ? 'num' : undefined} style={{ width: c.width }}>{c.label}</th>)}</tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={rowKey ? r[rowKey] : i} onClick={onRowClick ? () => onRowClick(r) : undefined} style={onRowClick ? { cursor: 'pointer' } : undefined}>
            {columns.map(c => <td key={c.key} className={c.numeric ? 'num' : undefined}>{c.render ? c.render(r) : r[c.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}