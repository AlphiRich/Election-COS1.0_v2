import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function CapabilityToken({ sub, tenant, capabilities = [], scope = [], issued, expires, kid, remaining = 1, status = 'valid', style }) {
  const pct = Math.max(0, Math.min(1, remaining)) * 100;
  const label = { valid: 'Signed · verified offline', expiring: 'Expiring soon', revoked: 'Revoked on sync', expired: 'Expired' }[status];
  return (
    <div className="ecos-token ecos-inverse" style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '600 11px/1 var(--font-body)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--amber)' }}>
          <Icon name={status === 'revoked' || status === 'expired' ? 'lock-simple' : 'seal-check'} size={18} />Capability token
        </div>
        <span style={{ font: '500 12px/1 var(--font-mono)', color: 'var(--paper)', opacity: .7 }}>{kid}</span>
      </div>
      <dl className="ecos-token__claims">
        <dt>sub</dt><dd>{sub}</dd>
        <dt>tenant_id</dt><dd>{tenant}</dd>
        <dt>scope</dt><dd>{scope.join(', ')}</dd>
        <dt>capabilities</dt><dd>{capabilities.join(', ')}</dd>
        <dt>iat</dt><dd>{issued}</dd>
        <dt>exp</dt><dd>{expires}</dd>
      </dl>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="ecos-token__meter"><span style={{ width: pct + '%' }} /></div>
        <div style={{ fontSize: 12, lineHeight: '20px', color: 'var(--paper)' }}>{label}</div>
      </div>
    </div>
  );
}