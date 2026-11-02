function App() {
  const { SideNav, AppBar, StatusBadge, CodeTag, RoleBadge, Toast } = NS;
  const [view, setView] = React.useState(() => localStorage.getItem('ecos-rbac-view') || 'delegations');
  const [toast, setToast] = React.useState(null);
  const [audit, setAudit] = React.useState(KIT.AUDIT);
  React.useEffect(() => { localStorage.setItem('ecos-rbac-view', view); }, [view]);
  React.useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3600); return () => clearTimeout(t); }, [toast]);
  const addAudit = e => setAudit(a => [{ seq: a[0].seq + 1, ts: '2026-11-01 09:' + String(14 + a.length).padStart(2, '0') + ':00', actor: KIT.ME.name, hash: Math.random().toString(16).slice(2, 6) + '…' + Math.random().toString(16).slice(2, 6), ...e }, ...a]);
  const titles = { roles: 'Roles', matrix: 'Capability matrix', delegations: 'Delegations', keys: 'Signing keys', audit: 'Audit log' };
  const screens = { roles: <RolesScreen />, matrix: <MatrixScreen />, delegations: <DelegationsScreen onToast={setToast} onAudit={addAudit} />, keys: <KeysScreen onToast={setToast} onAudit={addAudit} />, audit: <AuditScreen entries={audit} /> };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '248px minmax(0,1fr)', minHeight: '100vh' }}>
      <SideNav value={view} onChange={setView} style={{ position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' }}
        sections={[
          { title: 'War Room', items: [{ value: 'overview', label: 'Overview', icon: 'squares-four' }, { value: 'wards', label: 'Wards', icon: 'map-trifold' }, { value: 'seats', label: 'Seat calculator', icon: 'calculator' }] },
          { title: 'Access', items: [{ value: 'roles', label: 'Roles', icon: 'users-three', meta: '6' }, { value: 'matrix', label: 'Capabilities', icon: 'grid-four' }, { value: 'delegations', label: 'Delegations', icon: 'handshake' }, { value: 'keys', label: 'Signing keys', icon: 'key' }, { value: 'audit', label: 'Audit log', icon: 'scroll' }] },
        ]}
        footer={<div style={{ fontSize: 12, lineHeight: '18px', color: 'var(--paper)', opacity: .7 }}>electioncos.co.za</div>} />
      <div style={{ minWidth: 0 }}>
        <AppBar crumbs={['Settings', 'Access']} title={titles[view] || 'War Room'} right={<><StatusBadge status="built">Synced 09:12</StatusBadge><CodeTag>NW405 · JB Marks</CodeTag><RoleBadge role="WARD_LEAD" /></>} />
        <main style={{ maxWidth: 1200, padding: '40px 40px 96px', boxSizing: 'border-box' }}>
          {screens[view] || <div style={{ color: 'var(--slate)', paddingTop: 48 }}><h3 style={{ color: 'var(--ink)', marginBottom: 8 }}>{view === 'seats' ? 'Seat calculator' : view === 'wards' ? 'Wards' : 'Overview'}</h3>Outside this kit's scope — see the Access section.</div>}
        </main>
      </div>
      {toast && <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60 }}><Toast tone="success" onDismiss={() => setToast(null)}>{toast}</Toast></div>}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);