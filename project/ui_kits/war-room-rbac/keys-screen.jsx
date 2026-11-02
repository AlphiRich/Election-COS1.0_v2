function KeysScreen({ onToast, onAudit }) {
  const { Table, Button, StatusBadge, CodeTag, Dialog, Alert, CapabilityToken } = NS;
  const [keys, setKeys] = React.useState(KIT.KEYS);
  const [confirm, setConfirm] = React.useState(false);
  const rotate = () => {
    const kid = 'ecos-2026-12';
    setKeys(ks => [{ kid, alg: 'ES256', created: '2026-11-01 09:14', status: 'active', tokens: 0 }, ...ks.map(k => k.status === 'active' ? { ...k, status: 'retiring' } : k.status === 'retiring' ? { ...k, status: 'retired', tokens: 0 } : k)]);
    setConfirm(false); onToast('Rotated to ' + kid); onAudit({ event: 'KEY_ROTATED', target: 'ecos-2026-11 → ' + kid });
  };
  const st = { active: ['built', 'Active'], retiring: ['roadmap', 'Retiring'], retired: ['neutral', 'Retired'] };
  const active = keys.find(k => k.status === 'active');
  return (
    <div>
      <PageHeader kicker="Access · rbac_signing_key" title="Signing keys" actions={<Button variant="ink" icon="key" onClick={() => setConfirm(true)}>Rotate key</Button>}>
        Capability tokens are signed with a rotating asymmetric key so field devices can verify permissions offline. Never a shared secret.
      </PageHeader>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 32, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          <div style={{ overflowX: 'auto' }}><Table rowKey="kid" columns={[
            { key: 'kid', label: 'Key ID', render: r => <CodeTag>{r.kid}</CodeTag> },
            { key: 'alg', label: 'Alg', render: r => <span className="ecos-mono" style={{ fontSize: 13 }}>{r.alg}</span> },
            { key: 'created', label: 'Created', render: r => <span className="ecos-mono" style={{ fontSize: 13 }}>{r.created}</span> },
            { key: 'tokens', label: 'Live tokens', numeric: true },
            { key: 'status', label: 'Status', render: r => <StatusBadge status={st[r.status][0]}>{st[r.status][1]}</StatusBadge> },
          ]} rows={keys} /></div>
          {keys.some(k => k.status === 'retiring' && k.tokens > 0) && <Alert tone="warning" title="Retiring key still in use">{keys.find(k => k.status === 'retiring').tokens} devices hold tokens signed with the previous key. They re-validate on reconnect and expire within 8 h.</Alert>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <div className="ecos-label">Sample token · current key</div>
          <CapabilityToken sub="usr_8f2c41" tenant="tn_nw405" kid={active.kid} scope={['NW405-W07', 'VD 10930012']} capabilities={['household.read', 'household.write', 'consent.capture']} issued="2026-11-01 06:00 SAST" expires="2026-11-01 14:00 SAST" remaining={0.62} />
          <p style={{ fontSize: 13, lineHeight: '21px', color: 'var(--slate)' }}>Tokens live for one operational session (8 h). A revoked delegation does not invalidate a signed token offline — short lifetimes bound that window.</p>
        </div>
      </div>
      {confirm && <Dialog title="Rotate signing key?" kicker="rbac_signing_key" onClose={() => setConfirm(false)} width={480}
        actions={<><Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button><Button variant="ink" icon="key" onClick={rotate}>Rotate now</Button></>}>
        <p>A new ES256 key becomes active for all new tokens. <CodeTag>{active.kid}</CodeTag> moves to retiring and keeps verifying until its tokens expire.</p>
      </Dialog>}
    </div>
  );
}
window.KeysScreen = KeysScreen;