function GrantDialog({ onClose, onGrant }) {
  const { Dialog, Button, Field, Select, Checkbox, Input, RuleCheck, CodeTag, RoleBadge } = NS;
  const { ME, CANVASSERS, ALL_VDS, CAPS, GRANTS, ROLES, CYCLE_END } = KIT;
  const [to, setTo] = React.useState(CANVASSERS[0].id);
  const [caps, setCaps] = React.useState(['household.read', 'consent.capture']);
  const [vds, setVds] = React.useState(['10930012']);
  const [until, setUntil] = React.useState('');
  const mine = GRANTS[ME.role];
  const held = CAPS.filter((c, i) => mine[i].s !== 'none' && mine[i].d).map(c => c.key);
  const offer = ['household.read', 'household.write', 'consent.capture', 'incident.create', 'pr_list.export'];
  const tog = (list, set, v) => set(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const target = CANVASSERS.find(c => c.id === to);
  const badCap = caps.filter(c => !held.includes(c));
  const badVd = vds.filter(v => !ME.vds.includes(v));
  const canDel = ROLES.find(r => r.key === ME.role).canDelegate;
  const opRole = target.role === 'VOLUNTEER';
  const rules = [
    { ok: canDel, pass: 'Field Coordinator may delegate', fail: 'Your role cannot delegate' },
    { ok: caps.length > 0 && !badCap.length, pass: 'You hold every capability selected', fail: badCap.length ? 'You do not hold ' + badCap.join(', ') : 'Select at least one capability' },
    { ok: vds.length > 0 && !badVd.length, pass: 'All voting districts are inside ' + ME.ward, fail: badVd.length ? 'VD ' + badVd.join(', ') + ' is outside ' + ME.ward : 'Select at least one voting district' },
    { ok: opRole, pass: 'Delegatee is a Canvasser — one level, no sub-delegation', fail: target.name + ' holds can_delegate — delegate to a Canvasser only' },
    { ok: !!until && until <= CYCLE_END, pending: !until, pass: 'Expires ' + until, fail: until ? 'valid_until exceeds campaign cycle (' + CYCLE_END + ')' : 'Set valid_until — delegations must expire' },
  ];
  const allOk = rules.every(r => r.ok);
  return (
    <Dialog title="Grant delegation" kicker={'Ward ' + ME.ward} onClose={onClose} width={620}
      actions={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button icon="handshake" disabled={!allOk} onClick={() => onGrant({ to: target.name, toRole: target.role, caps, vds, until })}>Grant & log</Button></>}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--slate)' }}>From <RoleBadge role={ME.role} /> {ME.name}</div>
      <Field label="Delegate to" htmlFor="to"><Select id="to" value={to} onChange={e => setTo(e.target.value)} options={CANVASSERS.map(c => ({ value: c.id, label: c.name + ' · ' + c.role }))} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div className="ecos-field__label">Capabilities</div>{offer.map(c => <Checkbox key={c} checked={caps.includes(c)} onChange={() => tog(caps, setCaps, c)} label={<CodeTag plain>{c}</CodeTag>} />)}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}><div className="ecos-field__label">Voting districts</div>{ALL_VDS.map(v => <Checkbox key={v} checked={vds.includes(v)} onChange={() => tog(vds, setVds, v)} label={<CodeTag plain>{v}</CodeTag>} />)}</div>
      </div>
      <Field label="Valid until" hint={'Required. Must fall within the campaign cycle (ends ' + CYCLE_END + ').'} htmlFor="vu"><Input id="vu" type="date" mono value={until} onChange={e => setUntil(e.target.value)} /></Field>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, background: 'var(--paper-sunk)', borderRadius: 2 }}>
        <div className="ecos-label">Policy checks · enforced by trigger</div>
        {rules.map((r, i) => <RuleCheck key={i} status={r.ok ? 'pass' : r.pending ? 'pending' : 'fail'}>{r.ok ? r.pass : r.fail}</RuleCheck>)}
      </div>
    </Dialog>
  );
}
function DelegationsScreen({ onToast, onAudit }) {
  const { Tabs, Table, Button, StatusBadge, RoleBadge, CodeTag, Stat, Dialog } = NS;
  const [rows, setRows] = React.useState(KIT.DELEGATIONS);
  const [tab, setTab] = React.useState('active');
  const [open, setOpen] = React.useState(false);
  const [revoke, setRevoke] = React.useState(null);
  const count = s => rows.filter(r => r.status === s).length;
  const shown = rows.filter(r => tab === 'active' ? r.status !== 'revoked' : r.status === tab);
  const grant = d => {
    const id = 'dlg_' + (4822 + rows.length);
    setRows(rs => [{ id, ...d, by: KIT.ME.name, byRole: KIT.ME.role, from: '2026-11-01', status: 'active' }, ...rs]);
    setOpen(false); onToast('Delegation ' + id + ' granted · logged'); onAudit({ event: 'DELEGATION_GRANTED', target: id + ' → ' + d.to });
  };
  const doRevoke = () => {
    setRows(rs => rs.map(r => r.id === revoke.id ? { ...r, status: 'revoked' } : r));
    onToast('Revoked ' + revoke.id + ' · enforced on next sync'); onAudit({ event: 'DELEGATION_REVOKED', target: revoke.id + ' → ' + revoke.to }); setRevoke(null);
  };
  const st = { active: ['built', 'Active'], expiring: ['roadmap', 'Expiring'], revoked: ['neutral', 'Revoked'] };
  return (
    <div>
      <PageHeader kicker="Access · capability_delegation" title="Delegations" actions={<Button icon="user-plus" onClick={() => setOpen(true)}>Grant delegation</Button>}>
        Scoped, time-boxed grants from a Field Coordinator or VD Captain to a Canvasser. Not a role change.
      </PageHeader>
      <div style={{ display: 'flex', gap: 64, marginBottom: 40, flexWrap: 'wrap' }}>
        <Stat label="Active" value={count('active') + count('expiring')} delta="Across 4 voting districts" />
        <Stat label="Expiring ≤ 7 days" value={count('expiring')} delta="Re-grant or let lapse" />
        <Stat label="Revoked" value={count('revoked')} delta="Enforced on reconnect" />
      </div>
      <Tabs value={tab} onChange={setTab} style={{ marginBottom: 8 }} tabs={[{ value: 'active', label: 'Current', count: count('active') + count('expiring') }, { value: 'expiring', label: 'Expiring', count: count('expiring') }, { value: 'revoked', label: 'Revoked', count: count('revoked') }]} />
      <div style={{ overflowX: 'auto' }}><Table rowKey="id" columns={[
        { key: 'id', label: 'ID', render: r => <CodeTag plain>{r.id}</CodeTag> },
        { key: 'to', label: 'Canvasser', render: r => <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontWeight: 600 }}>{r.to}</span><span style={{ fontSize: 12, color: 'var(--slate)' }}>by {r.by}</span></div> },
        { key: 'caps', label: 'Capabilities', render: r => <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{r.caps.map(c => <CodeTag key={c}>{c}</CodeTag>)}</div> },
        { key: 'vds', label: 'VDs', render: r => <span className="ecos-mono" style={{ fontSize: 13 }}>{r.vds.join(', ')}</span> },
        { key: 'until', label: 'Valid until', render: r => <span className="ecos-mono" style={{ fontSize: 13 }}>{r.until}</span> },
        { key: 'status', label: 'Status', render: r => <StatusBadge status={st[r.status][0]}>{st[r.status][1]}</StatusBadge> },
        { key: 'x', label: '', render: r => r.status !== 'revoked' ? <Button size="sm" variant="ghost" onClick={() => setRevoke(r)}>Revoke</Button> : null },
      ]} rows={shown} /></div>
      {open && <GrantDialog onClose={() => setOpen(false)} onGrant={grant} />}
      {revoke && <Dialog title="Revoke delegation?" kicker={revoke.id} onClose={() => setRevoke(null)} width={460}
        actions={<><Button variant="outline" onClick={() => setRevoke(null)}>Cancel</Button><Button variant="destructive" icon="prohibit" onClick={doRevoke}>Revoke</Button></>}>
        <p>{revoke.to}'s cached token stays valid offline until it expires (max 8 h). The revocation is enforced the moment their device reconnects, and written to the permission audit log.</p>
      </Dialog>}
    </div>
  );
}
window.DelegationsScreen = DelegationsScreen;