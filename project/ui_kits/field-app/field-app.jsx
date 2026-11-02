function Phone({ children }) {
  return <div style={{ width: 390, height: 844, borderRadius: 36, border: '10px solid var(--ink)', background: 'var(--paper)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-3)', flex: 'none' }}>{children}</div>;
}
function TopBar({ title, back, online }) {
  const { IconButton, StatusBadge } = NS;
  return (
    <div style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '12px 8px 12px 16px', display: 'flex', alignItems: 'center', gap: 8, minHeight: 64, boxSizing: 'border-box' }} className="ecos-inverse">
      {back && <IconButton icon="arrow-left" label="Back" onClick={back} size="lg" style={{ color: 'var(--paper)', marginLeft: -8 }} />}
      <div style={{ flex: 1, font: '700 18px/24px var(--font-display)' }}>{title}</div>
      <StatusBadge status={online ? 'built' : 'ink'}>{online ? 'Online' : 'Offline'}</StatusBadge>
    </div>
  );
}
function AuthScreen({ s, go }) {
  const { CapabilityToken, Button, Alert, RoleBadge, CodeTag } = NS;
  const t = FIELD.token;
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="ecos-label">Authorised by {FIELD.me.delegator}</div>
        <h3>{FIELD.me.name}</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><RoleBadge role="VOLUNTEER" /><CodeTag>VD 10930012</CodeTag></div>
      </div>
      {s.revoked && <Alert tone="critical" title="Delegation revoked">Your Field Coordinator revoked access at 10:42. Data captured offline has synced; new captures are blocked.</Alert>}
      {!s.revoked && !s.online && <Alert tone="info" title="Working offline">Permissions are verified on this device against your signed token. 1 capture queued.</Alert>}
      <CapabilityToken sub={FIELD.me.id} tenant={t.tenant} kid={t.kid} scope={t.scope} capabilities={s.revoked ? [] : t.caps} issued={t.iat} expires={t.exp} remaining={s.revoked ? 0 : 0.62} status={s.revoked ? 'revoked' : 'valid'} />
      <Button size="lg" block icon="house-line" disabled={s.revoked} onClick={() => go('list')}>Start canvass</Button>
    </div>
  );
}
function ListScreen({ s, go, pick }) {
  const { StatusBadge, Icon, CodeTag } = NS;
  const st = { todo: ['outline', 'To visit'], done: ['built', 'Captured'], queued: ['info', 'Queued'], locked: ['neutral', 'Out of scope'] };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="ecos-label">VD 10930012 · Ikageng Ext 2</span><span className="ecos-mono" style={{ fontSize: 13 }}>1 / 4</span>
      </div>
      {FIELD.households.map(h => {
        const locked = h.status === 'locked';
        return (
          <button key={h.id} disabled={locked} onClick={() => pick(h)} style={{ appearance: 'none', background: 'none', border: 0, borderBottom: '1px solid var(--line)', textAlign: 'left', padding: '12px 16px', minHeight: 72, display: 'flex', alignItems: 'center', gap: 12, cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? .6 : 1, font: 'inherit', color: 'var(--ink)' }}>
            <Icon name={locked ? 'lock-simple' : 'house-line'} size={24} style={{ color: locked ? 'var(--slate)' : 'var(--blue)' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{h.addr}</span>
              <span className="ecos-mono" style={{ fontSize: 12, lineHeight: '18px', color: 'var(--slate)' }}>{h.id}</span>
            </div>
            <StatusBadge status={st[h.status][0]}>{st[h.status][1]}</StatusBadge>
          </button>
        );
      })}
      <p style={{ padding: 16, fontSize: 13, lineHeight: '21px', color: 'var(--slate)' }}>Households outside VD 10930012 are locked by your token's scope.</p>
    </div>
  );
}
function CaptureScreen({ s, h, done }) {
  const { Checkbox, Radio, Button, Field, CodeTag, Alert } = NS;
  const [consent, setConsent] = React.useState(false);
  const [out, setOut] = React.useState('');
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><h3>{h.addr}</h3><CodeTag plain>{h.id}</CodeTag></div>
      <div style={{ padding: 16, background: 'var(--paper-sunk)', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="ecos-label">POPIA consent</div>
        <p style={{ fontSize: 14, lineHeight: '23px' }}>Read the consent notice aloud. Record only what the resident agrees to share.</p>
        <Checkbox checked={consent} onChange={e => setConsent(e.target.checked)} label="Resident gave informed consent" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div className="ecos-field__label" style={{ marginBottom: 8 }}>Outcome</div>
        {['Spoke with resident', 'Not home', 'Declined to engage', 'Moved / vacant'].map(o => (
          <label key={o} className="ecos-check" style={{ minHeight: 48, alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
            <input type="radio" name="out" checked={out === o} onChange={() => setOut(o)} disabled={!consent && o === 'Spoke with resident'} style={{ marginTop: 0 }} /><span style={{ fontSize: 15 }}>{o}</span>
          </label>
        ))}
      </div>
      <Button size="lg" block disabled={!out} icon={s.online ? 'check' : 'tray-arrow-up'} onClick={() => done(h, s.online ? 'done' : 'queued')}>{s.online ? 'Save capture' : 'Save to queue'}</Button>
    </div>
  );
}
function FieldApp() {
  const { Switch, Button, Toast } = NS;
  const [s, setS] = React.useState({ online: false, revoked: false });
  const [view, setView] = React.useState('auth');
  const [hh, setHh] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  React.useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }, [toast]);
  const done = (h, status) => { const x = FIELD.households.find(y => y.id === h.id); x.status = status; setToast(status === 'queued' ? 'Saved to device · syncs when online' : 'Capture saved'); setView('list'); };
  const title = { auth: 'My authorisation', list: 'Households', capture: 'Capture' }[view];
  const back = view === 'auth' ? null : () => setView(view === 'capture' ? 'list' : 'auth');
  return (
    <div style={{ display: 'flex', gap: 48, padding: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative' }}>
        <Phone>
          <TopBar title={title} back={back} online={s.online} />
          <div style={{ flex: 1, overflow: 'auto' }}>
            {view === 'auth' && <AuthScreen s={s} go={setView} />}
            {view === 'list' && <ListScreen s={s} go={setView} pick={h => { setHh(h); setView('capture'); }} />}
            {view === 'capture' && hh && <CaptureScreen s={s} h={hh} done={done} />}
          </div>
        </Phone>
        {toast && <div style={{ position: 'absolute', left: 20, right: 20, bottom: 32 }}><Toast tone="success">{toast}</Toast></div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 300, paddingTop: 24 }}>
        <div className="ecos-label">Demo controls</div>
        <Switch label="Device online" checked={s.online} onChange={e => setS({ ...s, online: e.target.checked })} />
        <Button variant="destructive" icon="prohibit" disabled={s.revoked || !s.online} onClick={() => { setS({ ...s, revoked: true }); setView('auth'); }}>Simulate revocation on sync</Button>
        <Button variant="outline" icon="arrow-counter-clockwise" onClick={() => { setS({ online: false, revoked: false }); setView('auth'); }}>Reset</Button>
        <p style={{ fontSize: 13, lineHeight: '21px', color: 'var(--slate)' }}>Revocation is only enforced once the device reconnects — the offline-first tradeoff the 8-hour token lifetime bounds.</p>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<FieldApp />);