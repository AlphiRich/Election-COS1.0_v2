function MatrixScreen() {
  const { RoleBadge, CapabilityCell, CodeTag, Button, Alert } = NS;
  const { ROLES, CAPS, GRANTS } = KIT;
  const [grants, setGrants] = React.useState(GRANTS);
  const [dirty, setDirty] = React.useState(0);
  const cycle = (role, i) => {
    if (role === 'HQ_ADMIN') return;
    const order = ['none', 'scoped', 'granted'];
    setGrants(g => { const row = g[role].slice(); const c = row[i]; row[i] = { ...c, s: order[(order.indexOf(c.s) + 1) % 3] }; return { ...g, [role]: row }; });
    setDirty(d => d + 1);
  };
  return (
    <div>
      <PageHeader kicker="Access · role_capability" title="Capability matrix"
        actions={dirty ? <><Button variant="outline" onClick={() => { setGrants(GRANTS); setDirty(0); }}>Discard</Button><Button icon="floppy-disk" onClick={() => setDirty(0)}>Save {dirty} change{dirty > 1 ? 's' : ''}</Button></> : null}>
        Default capability bundle per role. Click a cell to cycle none → scoped → granted. HQ is fixed.
      </PageHeader>
      <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--slate)', marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><CapabilityCell state="granted" /> Granted tenant-wide</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><CapabilityCell state="scoped" /> Granted within geographic scope</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><CapabilityCell state="scoped" delegable /> Holder may delegate</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="ecos-table">
          <thead><tr><th>Capability</th>{ROLES.map(r => <th key={r.key} style={{ textAlign: 'center' }}><RoleBadge role={r.key} /></th>)}</tr></thead>
          <tbody>
            {CAPS.map((c, i) => (
              <tr key={c.key}>
                <td><div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><CodeTag plain>{c.key}</CodeTag><span style={{ fontSize: 12, color: 'var(--slate)' }}>{c.desc}</span></div></td>
                {ROLES.map(r => <td key={r.key} style={{ textAlign: 'center' }}><CapabilityCell state={grants[r.key][i].s} delegable={grants[r.key][i].d} label={r.key + ' · ' + c.key} onClick={r.key === 'HQ_ADMIN' ? undefined : () => cycle(r.key, i)} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 24 }}><Alert tone="info" title="Canvassers hold nothing by default">Every Canvasser capability arrives through a time-boxed delegation from a Field Coordinator or VD Captain.</Alert></div>
    </div>
  );
}
window.MatrixScreen = MatrixScreen;