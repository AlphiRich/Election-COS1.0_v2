const pct = (v, d = 1) => (v * 100).toFixed(d) + '%';
const pp = v => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v).toFixed(1) + ' pp';
const fmtN = n => Math.round(n).toLocaleString('en-ZA');
function Swatch({ k }) { return <span style={{ width: 10, height: 10, borderRadius: 2, background: EL.P[k].color, display: 'inline-block', flex: 'none' }} />; }
function Provenance({ show, tier = 'demo', children }) {
  if (!show) return null;
  return <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', font: '500 11px/1 var(--font-mono)', letterSpacing: '.04em', color: tier === 'demo' ? 'var(--roadmap)' : 'var(--green)', padding: '4px 6px', background: tier === 'demo' ? 'var(--roadmap-tint)' : 'var(--green-tint)', borderRadius: 2 }}>{children || (tier === 'demo' ? 'INVENTED DEMO DATA' : 'TIER 2 SOURCE')}</span>;
}
function Stacked({ shares, h = 10, w = '100%' }) {
  return <div style={{ display: 'flex', width: w, height: h, borderRadius: 1, overflow: 'hidden' }}>{Object.entries(shares).map(([k, v]) => <span key={k} title={EL.P[k].label + ' ' + pct(v)} style={{ width: v * 100 + '%', background: EL.P[k].color }} />)}</div>;
}
function PartyBars({ shares, prev, title }) {
  const max = Math.max(...Object.values(shares));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="ecos-label">{title}</div>
      {Object.entries(shares).sort((a, b) => b[1] - a[1]).map(([k, v]) => {
        const d = prev && prev[k] != null ? (v - prev[k]) * 100 : null;
        return (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: '110px minmax(0,1fr) 64px 74px', gap: 12, alignItems: 'center', fontSize: 13 }}>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Swatch k={k} />{EL.P[k].label}</span>
            <div style={{ height: 16, background: 'var(--ink-tint)' }}><div style={{ width: v / max * 100 + '%', height: '100%', background: EL.P[k].color }} /></div>
            <span className="ecos-mono" style={{ fontSize: 13, textAlign: 'right' }}>{pct(v)}</span>
            <span className="ecos-mono" style={{ fontSize: 12, textAlign: 'right', color: 'var(--slate)' }}>{d == null ? '' : (d >= 0 ? '▲ ' : '▼ ') + pp(d).replace(/^[+−±]/, '')}</span>
          </div>
        );
      })}
    </div>
  );
}
function FormulaBar({ children }) { return <div style={{ font: '500 14px/22px var(--font-mono)', background: 'var(--paper-sunk)', borderLeft: '3px solid var(--ink)', padding: '10px 14px', overflowX: 'auto', whiteSpace: 'pre' }}>{children}</div>; }
function SeatWorking({ c, labels, prov, show }) {
  const { Table, CodeTag, StatusBadge } = NS;
  const L = k => labels ? (labels[k] || k) : (EL.P[k] ? EL.P[k].label : k);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}><h4>The PR formula, unpacked</h4>{prov}</div>
      <p style={{ fontSize: 14, lineHeight: '23px', color: 'var(--slate)', maxWidth: 720 }}>Schedule 1, Municipal Structures Act 117 of 1998. Add up every party's votes on both ballots, find the quota, give each party one seat per quota, hand out leftover seats by largest remainder, then subtract the wards each party already won.</p>
      <FormulaBar>{'Q = ⌊ A ÷ (B − C) ⌋ + 1      Item 12\n  = ⌊ ' + fmtN(c.A) + ' ÷ (' + c.B + ' − ' + c.C + ') ⌋ + 1 = ' + fmtN(c.Q)}</FormulaBar>
      <div style={{ fontSize: 12, color: 'var(--slate)' }}>A = valid votes for parties, both ballots (independents excluded) · B = council seats · C = independent ward councillors</div>
      <div style={{ overflowX: 'auto' }}><Table dense rowKey="key" columns={[
        { key: 'key', label: 'Party', render: x => <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{EL.P[x.key] && <Swatch k={x.key} />}{L(x.key)}</span> },
        { key: 'votes', label: 'Votes', numeric: true, render: x => fmtN(x.votes) },
        { key: 'ratio', label: 'Votes ÷ Q', numeric: true, render: x => x.ratio.toFixed(4) },
        { key: 'raw', label: 'Round 1', numeric: true },
        { key: 'rank', label: 'Rem. rank', numeric: true },
        { key: 'extra', label: 'Round 2', numeric: true },
        { key: 'total', label: 'Entitled', numeric: true },
        ...(c.rows.some(x => x.wards) ? [{ key: 'wards', label: 'Wards won', numeric: true }, { key: 'pr', label: 'PR seats', numeric: true }, { key: 'held', label: 'Held', numeric: true, render: x => <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>{x.held}{x.item16 && x.wards > x.total && <StatusBadge status="roadmap" dot={false}>Item 16</StatusBadge>}</span> }] : []),
      ]} rows={c.rows} /></div>
      <div style={{ fontSize: 13, color: 'var(--slate)' }}>Council: <span className="ecos-mono" style={{ color: 'var(--ink)' }}>{c.size}</span> seats{c.C ? ' incl. ' + c.C + ' independent' : ''}{c.overhang > 0 ? ' — ' + c.overhang + ' above the proclaimed ' + c.B + ' (Item 16 overhang, not capped)' : ''}.</div>
    </div>
  );
}
function SwingDiagnostic({ base, show }) {
  const pts = base.wards.map(x => ({ code: x.w.code, dx: (x.o.pr.A - x.p.pr.A) * 100, dy: (x.o.t - x.p.t) * 100 }));
  const r = EL.pearson(pts.map(p => p.dx), pts.map(p => p.dy));
  const W = 520, H = 280, P = 36;
  const xs = pts.map(p => p.dx), ys = pts.map(p => p.dy);
  const x0 = Math.min(...xs) - .5, x1 = Math.max(...xs) + .5, y0 = Math.min(...ys) - .5, y1 = Math.max(...ys) + .5;
  const X = v => P + (v - x0) / (x1 - x0) * (W - P * 1.5), Y = v => H - P - (v - y0) / (y1 - y0) * (H - P * 1.6);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}><h4>Swing diagnostic</h4><Provenance show={show} /></div>
      <p style={{ fontSize: 14, lineHeight: '23px', color: 'var(--slate)' }}>Hypothesis: wards where Party A lost share are the wards where turnout fell most. Each dot is a ward.</p>
      <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width: '100%', height: 'auto' }} role="img" aria-label="Scatter of Party A share change against turnout change by ward">
        <line x1={P} x2={W - P / 2} y1={Y(0)} y2={Y(0)} stroke="var(--line-strong)" /><line x1={X(0)} x2={X(0)} y1={P / 2} y2={H - P} stroke="var(--line-strong)" />
        {pts.map(p => <circle key={p.code} cx={X(p.dx)} cy={Y(p.dy)} r="5" fill="var(--blue)" fillOpacity=".85"><title>{p.code + ': ' + pp(p.dx) + ' share, ' + pp(p.dy) + ' turnout'}</title></circle>)}
        <text x={W - P / 2} y={H - 8} textAnchor="end" fontSize="11" fill="var(--slate)" fontFamily="var(--font-mono)">Party A share change (pp) →</text>
        <text x={P} y={14} fontSize="11" fill="var(--slate)" fontFamily="var(--font-mono)">↑ turnout change (pp)</text>
      </svg>
      <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <span className="ecos-mono" style={{ fontSize: 20 }}>r = {r.toFixed(2)}</span>
        <span style={{ fontSize: 13, color: 'var(--slate)' }}>Pearson, n = {pts.length} wards. Ecological (ward-level) correlation — it says nothing about individual voters switching.</span>
      </div>
    </div>
  );
}
function DrillScreen({ tw }) {
  const { Button, Stat, Table, CodeTag, StatusBadge, Icon, Tabs } = NS;
  const base = React.useMemo(() => EL.baseline({ bonus: tw.stressItem16 ? EL.STRESS : null }), [tw.stressItem16]);
  const [path, setPath] = React.useState([]);
  const [tab, setTab] = React.useState('results');
  const ward = path[0] != null ? base.wards.find(x => x.w.i === path[0]) : null;
  const vd = ward && path[1] != null ? ward.vds.find(x => x.v.code === path[1]) : null;
  const node = vd ? { o: vd.o, p: vd.p, title: 'Voting district ' + vd.v.code, code: vd.v.code } : ward ? { o: ward.o, p: ward.p, title: ward.w.name, code: ward.w.code } : { o: base.muni, p: base.prevMuni, title: EL.MUNI.name, code: EL.MUNI.code };
  const kids = vd ? [] : ward ? ward.vds.map(x => ({ id: x.v.code, code: x.v.code, o: x.o, p: x.p })) : base.wards.map(x => ({ id: x.w.i, code: x.w.code, o: x.o, p: x.p }));
  const rows = kids.map(k => ({ ...k, swingLead: (k.o.pr[k.o.winner === 'IND' ? 'A' : k.o.winner] - k.p.pr[k.o.winner === 'IND' ? 'A' : k.o.winner]) * 100, dT: (k.o.t - k.p.t) * 100, flip: k.o.winner !== k.p.winner, bg: k.o.margin < tw.battleground }))
    .sort((a, b) => tw.drillMetric === 'Turnout' ? a.o.t - b.o.t : tw.drillMetric === 'Swing' ? Math.abs(b.swingLead) - Math.abs(a.swingLead) : a.o.margin - b.o.margin);
  const nBg = rows.filter(r => r.bg).length;
  const crumbs = [{ label: EL.MUNI.code, go: [] }, ward && { label: ward.w.name, go: [ward.w.i] }, vd && { label: 'VD ' + vd.v.code, go: path }].filter(Boolean);
  const level = vd ? 'Voting district' : ward ? 'Ward' : 'Municipality';
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        {crumbs.map((c, i) => <React.Fragment key={i}>{i > 0 && <Icon name="caret-right" style={{ color: 'var(--line-strong)' }} />}<button className="ecos-btn ecos-btn--ghost ecos-btn--sm" aria-current={i === crumbs.length - 1 ? 'page' : undefined} style={i === crumbs.length - 1 ? { color: 'var(--ink)', fontWeight: 600 } : undefined} onClick={() => setPath(c.go)}>{c.label}</button></React.Fragment>)}
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}><Provenance show={tw.provenance} /><CodeTag>{EL.MUNI.demarcation}</CodeTag></span>
      </div>
      <PageHeader kicker={'Election results · ' + level} title={node.title}
        actions={path.length ? <Button variant="outline" icon="arrow-up" onClick={() => setPath(path.slice(0, -1))}>Up a level</Button> : null}>
        {EL.MUNI.event} vs {EL.MUNI.prevEvent}. Click any row to drill down: municipality → ward → voting district.
      </PageHeader>
      <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap', paddingBottom: 28, borderBottom: '1px solid var(--line)', marginBottom: 28 }}>
        <Stat label="Registered" value={fmtN(node.o.reg)} />
        <Stat label="Turnout" value={pct(node.o.t)} delta={pp((node.o.t - node.p.t) * 100) + ' vs previous'} />
        <Stat label="Valid votes (PR)" value={fmtN(node.o.valid)} />
        {!ward && <Stat label="Council" value={base.council.size + ' seats'} delta={base.council.overhang > 0 ? '+' + base.council.overhang + ' Item 16 overhang' : 'Proclaimed ' + EL.MUNI.B} />}
        {ward && <Stat label="Ward winner" value={<span style={{ display: 'inline-flex', gap: 10, alignItems: 'center', fontSize: 24 }}><Swatch k={node.o.winner} />{EL.P[node.o.winner].label}</span>} delta={'Margin ' + node.o.margin.toFixed(1) + ' pp over ' + EL.P[node.o.second].label} />}
      </div>
      {!ward && <Tabs value={tab} onChange={setTab} style={{ marginBottom: 28 }} tabs={[{ value: 'results', label: 'Results & wards', count: rows.length }, { value: 'battle', label: 'Battlegrounds', count: nBg }, { value: 'swing', label: 'Swing diagnostic' }, { value: 'formula', label: 'PR formula' }]} />}
      {(ward || tab === 'results' || tab === 'battle') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 40, marginBottom: 40 }}>
          <PartyBars title="PR ballot · share and change" shares={node.o.pr} prev={node.p.pr} />
          <PartyBars title={ward ? 'Ward ballot' : 'Ward ballots, combined'} shares={node.o.wardShares} prev={node.p.wardShares} />
        </div>
      )}
      {(ward && !vd) || (!ward && (tab === 'results' || tab === 'battle')) ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <h4>{ward ? 'Voting districts in ' + ward.w.name : tab === 'battle' ? 'Battleground wards' : 'Wards'}</h4>
            <span style={{ fontSize: 12, color: 'var(--slate)' }}>Sorted by {tw.drillMetric.toLowerCase()} · battleground = margin under {tw.battleground} pp</span>
          </div>
          <div style={{ overflowX: 'auto' }}><Table rowKey="id" onRowClick={k => setPath(ward ? [ward.w.i, k.id] : [k.id])} columns={[
            { key: 'code', label: ward ? 'VD' : 'Ward', render: k => <CodeTag>{k.code}</CodeTag> },
            { key: 'reg', label: 'Registered', numeric: true, render: k => fmtN(k.o.reg) },
            { key: 't', label: 'Turnout', numeric: true, render: k => <span style={{ fontWeight: tw.drillMetric === 'Turnout' ? 600 : 400 }}>{pct(k.o.t)}</span> },
            { key: 'w', label: 'Ward ballot lead', render: k => <span style={{ display: 'flex', gap: 8, alignItems: 'center', whiteSpace: 'nowrap' }}><Swatch k={k.o.winner} />{EL.P[k.o.winner].label}{k.flip && <StatusBadge status="info" dot={false}>Flipped</StatusBadge>}</span> },
            { key: 'm', label: 'Margin', numeric: true, render: k => <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', fontWeight: tw.drillMetric === 'Margin' ? 600 : 400 }}>{k.bg && <StatusBadge status="roadmap" dot={false}>Battleground</StatusBadge>}{k.o.margin.toFixed(1)} pp</span> },
            { key: 's', label: 'Lead swing', numeric: true, render: k => <span style={{ fontWeight: tw.drillMetric === 'Swing' ? 600 : 400 }}>{pp(k.swingLead)}</span> },
            { key: 'bar', label: 'PR ballot', render: k => <Stacked shares={k.o.pr} w={120} /> },
            { key: 'go', label: '', render: () => <Icon name="caret-right" style={{ color: 'var(--slate)' }} /> },
          ]} rows={!ward && tab === 'battle' ? rows.filter(r => r.bg) : rows} /></div>
        </div>
      ) : null}
      {vd && <div style={{ fontSize: 13, color: 'var(--slate)', display: 'flex', gap: 8 }}><Icon name="info" style={{ color: 'var(--blue)' }} />The voting district is the lowest level the IEC publishes results at. Nothing here is linked to an individual voter.</div>}
      {!ward && tab === 'swing' && <SwingDiagnostic base={base} show={tw.provenance} />}
      {!ward && tab === 'formula' && <SeatWorking c={base.council} prov={<Provenance show={tw.provenance} />} />}
    </div>
  );
}
window.DrillScreen = DrillScreen; window.SeatWorking = SeatWorking; window.Provenance = Provenance; window.Swatch = Swatch;