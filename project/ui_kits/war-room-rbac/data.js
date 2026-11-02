window.KIT = (() => {
const ROLES = [
  { key: 'HQ_ADMIN', scope: 'Tenant-wide', canDelegate: true, users: 3, policies: 14 },
  { key: 'LOCAL_HEAD', scope: 'Municipal · NW405', canDelegate: true, users: 1, policies: 11 },
  { key: 'FINANCE_OFFICER', scope: 'Tenant-wide', canDelegate: false, users: 2, policies: 4, note: 'Seeded in migration 0042 — previously referenced by household RLS but missing from the seed' },
  { key: 'WARD_LEAD', scope: 'Ward', canDelegate: true, users: 9, policies: 8 },
  { key: 'VD_CAPTAIN', scope: 'Voting district', canDelegate: true, users: 31, policies: 6 },
  { key: 'VOLUNTEER', scope: 'Voting district (assigned captain)', canDelegate: false, users: 214, policies: 5 },
];
const CAPS = [
  { key: 'household.read', desc: 'View household records in scope' },
  { key: 'household.write', desc: 'Record canvass outcomes' },
  { key: 'voter.read', desc: 'View voter roll entries' },
  { key: 'consent.capture', desc: 'Capture POPIA consent at the door' },
  { key: 'incident.create', desc: 'Log a field incident' },
  { key: 'pr_list.export', desc: 'Export the PR candidate list' },
  { key: 'donation.record', desc: 'Record a PPFA donation' },
  { key: 'demarcation.configure', desc: 'Edit ward & demarcation baseline' },
  { key: 'delegation.grant', desc: 'Delegate capabilities downward' },
  { key: 'rbac.manage', desc: 'Edit roles and capability bundles' },
];
const G = (s, d) => ({ s, d: !!d });
const GRANTS = {
  HQ_ADMIN:        [G('granted',1),G('granted',1),G('granted',1),G('granted',1),G('granted',1),G('granted'),G('granted'),G('granted'),G('granted'),G('granted')],
  LOCAL_HEAD:      [G('scoped',1),G('scoped',1),G('scoped',1),G('scoped',1),G('scoped',1),G('scoped'),G('none'),G('none'),G('scoped'),G('none')],
  FINANCE_OFFICER: [G('granted'),G('none'),G('granted'),G('none'),G('none'),G('none'),G('granted'),G('none'),G('none'),G('none')],
  WARD_LEAD:       [G('scoped',1),G('scoped',1),G('scoped'),G('scoped',1),G('scoped',1),G('none'),G('none'),G('none'),G('scoped'),G('none')],
  VD_CAPTAIN:      [G('scoped',1),G('scoped',1),G('scoped'),G('scoped',1),G('scoped'),G('none'),G('none'),G('none'),G('scoped'),G('none')],
  VOLUNTEER:       [G('none'),G('none'),G('none'),G('none'),G('none'),G('none'),G('none'),G('none'),G('none'),G('none')],
};
const ME = { name: 'Lerato Dlamini', role: 'WARD_LEAD', ward: 'NW405-W07', vds: ['10930012','10930013','10930014','10930015'] };
const CANVASSERS = [
  { id: 'usr_8f2c41', name: 'Thandiwe Mokoena', role: 'VOLUNTEER' },
  { id: 'usr_3a9e07', name: 'Pieter van Wyk', role: 'VOLUNTEER' },
  { id: 'usr_c51d88', name: 'Ayesha Patel', role: 'VOLUNTEER' },
  { id: 'usr_77b0f2', name: 'Kagiso Molefe', role: 'VD_CAPTAIN' },
];
const ALL_VDS = [...ME.vds, '10930020'];
const CYCLE_END = '2026-12-31';
const DELEGATIONS = [
  { id: 'dlg_4821', to: 'Thandiwe Mokoena', toRole: 'VOLUNTEER', by: 'Lerato Dlamini', byRole: 'WARD_LEAD', caps: ['household.read','household.write','consent.capture'], vds: ['10930012'], from: '2026-10-20', until: '2026-11-30', status: 'active' },
  { id: 'dlg_4817', to: 'Pieter van Wyk', toRole: 'VOLUNTEER', by: 'Lerato Dlamini', byRole: 'WARD_LEAD', caps: ['household.read','consent.capture'], vds: ['10930013','10930014'], from: '2026-10-18', until: '2026-11-04', status: 'expiring' },
  { id: 'dlg_4790', to: 'Ayesha Patel', toRole: 'VOLUNTEER', by: 'Kagiso Molefe', byRole: 'VD_CAPTAIN', caps: ['household.read','household.write'], vds: ['10930015'], from: '2026-10-10', until: '2026-11-30', status: 'active' },
  { id: 'dlg_4702', to: 'Sipho Ndlovu', toRole: 'VOLUNTEER', by: 'Lerato Dlamini', byRole: 'WARD_LEAD', caps: ['household.read'], vds: ['10930014'], from: '2026-09-28', until: '2026-10-28', status: 'revoked' },
];
const KEYS = [
  { kid: 'ecos-2026-11', alg: 'ES256', created: '2026-11-01 00:00', status: 'active', tokens: 186 },
  { kid: 'ecos-2026-10', alg: 'ES256', created: '2026-10-01 00:00', status: 'retiring', tokens: 3 },
  { kid: 'ecos-2026-09', alg: 'ES256', created: '2026-09-01 00:00', status: 'retired', tokens: 0 },
];
const AUDIT = [
  { seq: 9314, ts: '2026-11-01 08:42:10', actor: 'Lerato Dlamini', event: 'DELEGATION_GRANTED', target: 'dlg_4821 → usr_8f2c41', hash: '9c1e…a07f' },
  { seq: 9313, ts: '2026-11-01 08:15:52', actor: 'system', event: 'TOKEN_REVALIDATED', target: 'usr_3a9e07 · ecos-2026-11', hash: '42bd…19c3' },
  { seq: 9312, ts: '2026-11-01 00:00:01', actor: 'system', event: 'KEY_ROTATED', target: 'ecos-2026-10 → ecos-2026-11', hash: 'e870…5d21' },
  { seq: 9311, ts: '2026-10-31 17:03:44', actor: 'Lerato Dlamini', event: 'DELEGATION_REVOKED', target: 'dlg_4702 → usr_0d4e19', hash: '1fa3…c8e0' },
  { seq: 9310, ts: '2026-10-31 11:20:09', actor: 'Naledi Khumalo', event: 'ROLE_ASSIGNED', target: 'usr_77b0f2 · VD_CAPTAIN · 10930015', hash: 'b6c2…7e44' },
  { seq: 9309, ts: '2026-10-30 09:01:33', actor: 'Naledi Khumalo', event: 'CAPABILITY_BUNDLE_EDITED', target: 'FINANCE_OFFICER + donation.record', hash: '03d9…ab12' },
];
return { ROLES, CAPS, GRANTS, ME, CANVASSERS, ALL_VDS, CYCLE_END, DELEGATIONS, KEYS, AUDIT };
})();