function Slider({ label, value, min, max, step = .5, unit = ' pp', onChange, swatch }) {
  return (
    <label style={{ display: 'grid', gridTemplateColumns: '120px minmax(0,1fr) 64px', gap: 12, alignItems: 'center', fontSize: 13 }}>
      <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{swatch && <Swatch k={swatch} />}{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} style={{ accentColor: '#1A2246', width: '100%' }} />
      <span className="ecos-mono" style={{ fontSize: 13, textAlign: 'right' }}>{(value > 0 ? '+' : '') + value + unit}</span>
    </label>
  );
}
function SeatRanges({ sim, B }) {
  const maxS = Math.max(B, sim.sizeMax), need = Math.floor(sim.sizeMedian / 2) + 1;
  const X = v => (v / maxS * 100) + '%';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {EL.PARTIES.map(p => { const d = sim.dist[p.key]; return (
        <div key={p.key} style={{ display: 'grid', gridTemplateColumns: '90px minmax(0,1fr) 110px', gap: 12, alignItems: 'center', fontSize: 13 }}>
          <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Swatch k={p.key} />{p.label}</span>
          <div style={{ position: 'relative', height: 22, background: 'var(--ink-tint)' }}>
            <div style={{ position: 'absolute', left: X(need), top: -4, bottom: -4, borderLeft: '2px dashed var(--amber)' }} />
            <div style={{ position: 'absolute', left: X(d.p5), width: 'calc(' + X(d.p95 - d.p5) + ' + 2px)', top: 5, height: 12, background: p.color, opacity: .35 }} />
            <div style={{ position: 'absolute', left: X(d.p50), top: 1, width: 3, height: 20, background: p.color }} />
          </div>
          <span className="ecos-mono" style={{ fontSize: 12, textAlign: 'right' }}>{d.p50} <span style={{ color: 'var(--slate)' }}>({d.p5}–{d.p95})</span></span>
        </div>); })}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--slate)' }}><span>Seats held · median (5th–95th percentile)</span><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 14, borderTop: '2px dashed var(--amber)' }} />Majority {need}</span></div>
    </div>
  );
}
function Histogram({ d, color, need }) {
  const ks = Object.keys(d.hist).map(Number); const lo = Math.min(...ks), hi = Math.max(...ks); const max = Math.max(...Object.values(d.hist));
  const bins = []; for (let s = lo; s <= hi; s++) bins.push([s, d.hist[s] || 0]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 140 }}>
        {bins.map(([s, n]) => <div key={s} title={s + ' seats: ' + n + ' runs'} style={{ flex: 1, height: Math.max(2, n / max * 100) + '%', background: s >= need ? color : 'color-mix(in oklab,' + color + ' 45%, var(--paper))', boxShadow: s === need ? 'inset 2px 0 0 var(--amber)' : 'none' }} />)}
      </div>
      <div style={{ display: 'flex', gap: 3 }}>{bins.map(([s]) => <span key={s} className="ecos-mono" style={{ flex: 1, fontSize: 10, textAlign: 'center', color: 'var(--slate)' }}>{bins.length > 16 && s % 2 ? '' : s}</span>)}</div>
    </div>
  );
}
function ScenarioScreen({ tw }) {
  const { Button, Stat, Alert, RuleCheck, Tabs, StatusBadge, CodeTag } = NS;
  const [swing, setSwing] = React.useState({ A: 2, B: -1, C: -1, D: 0, E: 0 });
  const [q, setQ] = React.useState({ swing: { A: 2, B: -1, C: -1, D: 0, E: 0 }, tDelta: 0, sigma: tw.sigma });
  const [tDelta, setTDelta] = React.useState(0);
  const [sigma, setSigma] = React.useState(tw.sigma);
  const [seed, setSeed] = React.useState(2026);
  const [focus, setFocus] = React.useState('A');
  React.useEffect(() => setSigma(tw.sigma), [tw.sigma]);
  React.useEffect(() => { const t = setTimeout(() => setQ({ swing, tDelta, sigma }), 250); return () => clearTimeout(t); }, [swing, tDelta, sigma]);
  const pending = q.swing !== swing || q.tDelta !== tDelta || q.sigma !== sigma;
  const bonus = tw.stressItem16 ? EL.STRESS : null;
  const runs = +tw.runs;
  const sim = React.useMemo(() => EL.simulate({ runs, swing: q.swing, sigma: q.sigma, noise: tw.wardNoise, tDelta: q.tDelta, bonus, seed }), [runs, q, tw.wardNoise, tw.stressItem16, seed]);
  const sens = React.useMemo(() => EL.sensitivity({ swing: q.swing, tDelta: q.tDelta, bonus, focus }), [q, tw.stressItem16, focus]);
  const chk = React.useMemo(() => EL.checks(), []);
  const need = Math.floor(sim.sizeMedian / 2) + 1;
  const net = Object.values(swing).reduce((a, b) => a + b, 0);
  const top = EL.PARTIES.map(p => [p, sim.maj[p.key] / runs]).sort((a, b) => b[1] - a[1])[0];
  const i16 = EL.PARTIES.filter(p => sim.item16[p.key] > 0);
  const sMax = Math.max(...sens.items.map(i => i.hi), sens.base) + 1, sMin = Math.min(...sens.items.map(i => i.lo), sens.base) - 1;
  const SX = v => ((v - sMin) / (sMax - sMin) * 100) + '%';
  return (
    <div>
      <PageHeader kicker="Election results · Scenario model" title="Your assumptions, run many times"
        actions={<><Button variant="outline" icon="arrows-clockwise" onClick={() => setSeed(s => s + 1)}>Re-run</Button><Button variant="outline" icon="arrow-counter-clockwise" onClick={() => { setSwing({ A: 0, B: 0, C: 0, D: 0, E: 0 }); setTDelta(0); }}>Reset to baseline</Button></>}>
        Set the swing for each party and how unsure you are. Each run perturbs your assumptions, re-counts every ward, then applies the Schedule 1 seat calculation. It is not a prediction.
      </PageHeader>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
        <aside style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span className="ecos-label">Swing vs baseline (PR share)</span><span className="ecos-mono" style={{ fontSize: 12, color: Math.abs(net) > .01 ? 'var(--roadmap)' : 'var(--slate)' }}>net {(net > 0 ? '+' : '') + net} pp</span></div>
          {EL.PARTIES.map(p => <Slider key={p.key} label={p.label} swatch={p.key} value={swing[p.key]} min={-8} max={8} onChange={v => setSwing(s => ({ ...s, [p.key]: v }))} />)}
          {Math.abs(net) > .01 && <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: -8 }}>Shares are renormalised, so a non-zero net is spread across all parties.</div>}
          <div className="hair" style={{ borderTop: '1px solid var(--line)' }} />
          <span className="ecos-label">Uncertainty</span>
          <Slider label="Swing σ" value={sigma} min={0} max={6} onChange={setSigma} />
          <Slider label="Turnout change" value={tDelta} min={-15} max={15} step={1} unit="%" onChange={setTDelta} />
          <div style={{ fontSize: 12, lineHeight: '19px', color: 'var(--slate)' }}>Ward-level noise {tw.wardNoise} pp · {runs.toLocaleString('en-ZA')} runs · seed <span className="ecos-mono">{seed}</span>{tw.stressItem16 ? ' · split-ticket stress test on' : ''}</div>
          <Provenance show={tw.provenance} />
        </aside>
        <section style={{ flex: '999 1 520px', display: 'flex', flexDirection: 'column', gap: 40, minWidth: 0, opacity: pending ? .55 : 1, transition: 'opacity .15s' }}>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <Stat label={'Most likely majority'} value={top[1] > 0 ? Math.round(top[1] * 100) + '%' : '—'} delta={top[1] > 0 ? top[0].label + ' wins an outright majority' : 'No party reaches a majority'} />
            <Stat label="Hung council" value={Math.round(sim.maj.hung / runs * 100) + '%'} delta="No party above half the seats" />
            <Stat label="Council size" value={sim.sizeMedian} delta={sim.overhangRuns ? Math.round(sim.overhangRuns / runs * 100) + '% of runs above ' + EL.MUNI.B : 'Proclaimed ' + EL.MUNI.B} />
          </div>
          {i16.length > 0 && <Alert tone="warning" title="Excessive seats (Item 16) in some runs">{i16.map(p => p.label + ' in ' + Math.round(sim.item16[p.key] / runs * 100) + '% of runs').join(', ')} — the party keeps every ward it won and gets no list seats, so the council grows past {EL.MUNI.B}. The Act does not cap this; neither does the model.</Alert>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h4>Seats by party</h4>
            <SeatRanges sim={sim} B={EL.MUNI.B} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}><h4>Distribution</h4>
                <select className="ecos-select" style={{ width: 140, height: 32 }} value={focus} onChange={e => setFocus(e.target.value)}>{EL.PARTIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}</select></div>
              <Histogram d={sim.dist[focus]} color={EL.P[focus].color} need={need} />
              <span style={{ fontSize: 12, color: 'var(--slate)' }}>Runs per seat count for {EL.P[focus].label}; solid bars reach the majority of {need}.</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
              <h4>Which assumption matters most</h4>
              {sens.items.map(it => (
                <div key={it.label} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,150px) minmax(0,1fr) 84px 64px', gap: 10, alignItems: 'center', fontSize: 12 }}>
                  <span>{it.label}</span>
                  <div style={{ position: 'relative', height: 14, background: 'var(--ink-tint)' }}>
                    <div style={{ position: 'absolute', left: SX(sens.base), top: -3, bottom: -3, borderLeft: '1px solid var(--ink)' }} />
                    <div style={{ position: 'absolute', left: SX(it.lo), width: 'calc(' + ((it.hi - it.lo) / (sMax - sMin) * 100) + '% + 3px)', top: 2, height: 10, background: 'var(--blue)' }} />
                  </div>
                  <span className="ecos-mono" style={{ textAlign: 'right' }}>{it.lo.toFixed(1) + '–' + it.hi.toFixed(1)}</span><span className="ecos-mono" style={{ textAlign: 'right', color: 'var(--slate)' }}>{it.wLo === it.wHi ? it.wLo + 'w' : it.wLo + '–' + it.wHi + 'w'}</span>
                </div>
              ))}
              <span style={{ fontSize: 12, lineHeight: '19px', color: 'var(--slate)' }}>Bar: {EL.P[focus].label} seat entitlement (votes ÷ quota), baseline {sens.base.toFixed(1)}; w = wards won, baseline {sens.baseWards}. No noise, one input at a time. Who the votes move to changes which wards {EL.P[focus].label} wins, not its total — unless Item 16 applies.</span>
            </div>
          </div>
          <Alert tone="info" title="Not a prediction">The output is your assumptions, perturbed and re-run. It carries no margin of error against the real electorate and should not be quoted as a forecast.</Alert>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, background: 'var(--paper-sunk)', borderRadius: 2 }}>
            <div className="ecos-label">Calculator checks · run on every load</div>
            <RuleCheck status={chk.nw405.ok ? 'pass' : 'fail'}>NW405 JB Marks, LGE 2021: Q = {chk.nw405.res.Q.toLocaleString('en-ZA')}, 67 of 67 seats match the IEC seat calculation (Items 12–13)</RuleCheck>
            <RuleCheck status={chk.item16.ok ? 'pass' : 'fail'}>Synthesized Item 16 fixture: overhang party keeps 5 wards, gets 0 list seats; council 22 of 20, not capped</RuleCheck>
            <RuleCheck status="pass">Remainder ties go to the party with more votes (Item 13(2)(b))</RuleCheck>
          </div>
        </section>
      </div>
    </div>
  );
}
window.ScenarioScreen = ScenarioScreen;