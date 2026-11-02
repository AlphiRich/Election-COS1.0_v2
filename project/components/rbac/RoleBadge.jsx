import React from 'react';
export const ROLES = {
  HQ_ADMIN: { label: 'Party HQ', glyph: 'HQ', scope: 'Tenant' },
  LOCAL_HEAD: { label: 'Local Election Head', glyph: 'LH', scope: 'Municipal' },
  FINANCE_OFFICER: { label: 'Finance Officer', glyph: 'FO', scope: 'Tenant' },
  WARD_LEAD: { label: 'Field Coordinator', glyph: 'FC', scope: 'Ward' },
  VD_CAPTAIN: { label: 'VD Captain', glyph: 'VC', scope: 'Voting District' },
  VOLUNTEER: { label: 'Canvasser', glyph: 'CV', scope: 'Voting District' },
};
export function RoleBadge({ role, showKey }) {
  const r = ROLES[role] || { label: role, glyph: '?' };
  return (
    <span className="ecos-role" title={role}>
      <span className="ecos-role__glyph">{r.glyph}</span>
      <span className="ecos-role__label">{r.label}</span>
      {showKey && <span className="ecos-role__key">{role}</span>}
    </span>
  );
}