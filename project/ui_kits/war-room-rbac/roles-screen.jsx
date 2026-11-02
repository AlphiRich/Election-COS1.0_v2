function RolesScreen() {
  const { RoleBadge, CodeTag, Table, Alert, StatusBadge, Icon } = NS;
  const { ROLES } = KIT;
  return (
    <div>
      <PageHeader kicker="Access · Role registry" title="Roles">The role table is the single source of truth. RLS policies and app code check against it — never a hardcoded list.</PageHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        <Alert tone="success" title="Registry reconciled">6 of 6 roles referenced by RLS policies exist as rows in <CodeTag>role</CodeTag>. Last checked 08:00 SAST.</Alert>
      </div>
      <Table rowKey="key" columns={[
        { key: 'role', label: 'Role', render: r => <RoleBadge role={r.key} /> },
        { key: 'key', label: 'DB key', render: r => <CodeTag>{r.key}</CodeTag> },
        { key: 'scope', label: 'Scope' },
        { key: 'canDelegate', label: 'Can delegate', render: r => r.canDelegate ? <StatusBadge status="built">Yes</StatusBadge> : <StatusBadge status="neutral">No</StatusBadge> },
        { key: 'users', label: 'Users', numeric: true },
        { key: 'policies', label: 'RLS refs', numeric: true },
      ]} rows={ROLES} />
      <div style={{ marginTop: 16, fontSize: 13, lineHeight: '21px', color: 'var(--slate)', display: 'flex', gap: 8 }}>
        <Icon name="info" style={{ color: 'var(--blue)' }} />
        <span><strong style={{ color: 'var(--ink)' }}>FINANCE_OFFICER</strong> — {ROLES[2].note}.</span>
      </div>
      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h4>UI labels map to DB roles</h4>
          <p style={{ fontSize: 14, lineHeight: '23px', color: 'var(--slate)' }}>Copy shows the label; data, tokens and policies use the key. <CodeTag>WARD_LEAD</CodeTag> is "Field Coordinator"; <CodeTag>VOLUNTEER</CodeTag> is "Canvasser".</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h4>Not login roles</h4>
          <p style={{ fontSize: 14, lineHeight: '23px', color: 'var(--slate)' }}>WBS task owners — <CodeTag>COMPLIANCE_OFFICER</CodeTag> <CodeTag>COMMS_DIRECTOR</CodeTag> <CodeTag>FIELD_ORGANIZER</CodeTag> — are project-delivery labels and stay out of this table without a product decision.</p>
        </div>
      </div>
    </div>
  );
}
window.RolesScreen = RolesScreen;