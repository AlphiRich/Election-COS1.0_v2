function AuditScreen({ entries }) {
  const { Table, CodeTag, Tabs, Icon } = NS;
  const [tab, setTab] = React.useState('all');
  const groups = { all: null, delegation: ['DELEGATION_GRANTED', 'DELEGATION_REVOKED'], keys: ['KEY_ROTATED', 'TOKEN_REVALIDATED'], roles: ['ROLE_ASSIGNED', 'CAPABILITY_BUNDLE_EDITED'] };
  const rows = entries.filter(e => !groups[tab] || groups[tab].includes(e.event));
  return (
    <div>
      <PageHeader kicker="Access · permission_audit_log" title="Audit log">Every grant, revocation, role assignment and key rotation, reconstructable after the fact.</PageHeader>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--slate)', marginBottom: 16 }}><Icon name="lock-simple" style={{ color: 'var(--ink)' }} />Append-only · each entry hashes the one before it</div>
      <Tabs value={tab} onChange={setTab} style={{ marginBottom: 8 }} tabs={[{ value: 'all', label: 'All', count: entries.length }, { value: 'delegation', label: 'Delegations' }, { value: 'roles', label: 'Roles' }, { value: 'keys', label: 'Keys & tokens' }]} />
      <Table dense rowKey="seq" columns={[
        { key: 'seq', label: 'Seq', numeric: true },
        { key: 'ts', label: 'Timestamp (SAST)', render: r => <span className="ecos-mono" style={{ fontSize: 13 }}>{r.ts}</span> },
        { key: 'actor', label: 'Actor', render: r => r.actor === 'system' ? <span style={{ color: 'var(--slate)' }}>system</span> : r.actor },
        { key: 'event', label: 'Event', render: r => <CodeTag>{r.event}</CodeTag> },
        { key: 'target', label: 'Target', render: r => <span className="ecos-mono" style={{ fontSize: 13 }}>{r.target}</span> },
        { key: 'hash', label: 'Hash', render: r => <span className="ecos-mono" style={{ fontSize: 12, color: 'var(--slate)' }}>{r.hash}</span> },
      ]} rows={rows} />
    </div>
  );
}
window.AuditScreen = AuditScreen;