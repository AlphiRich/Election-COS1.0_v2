function ProgressScreen({ question, files, onDone, onCancel }) {
  const { Button, CodeTag, Icon, StatusBadge, RuleCheck } = NS;
  const [step, setStep] = React.useState(0);
  const [log, setLog] = React.useState([{ t: 'info', c: 'Environment created · ' + files.length + ' file' + (files.length > 1 ? 's' : '') + ' staged at /.agents/data/' }]);
  React.useEffect(() => {
    if (step >= AN.STAGES.length) { const t = setTimeout(onDone, 700); return () => clearTimeout(t); }
    const t = setTimeout(() => {
      const s = AN.STAGES[step];
      setLog(l => [...l, { t: 'tool_call', c: s.cmd }, ...(AN.THOUGHTS[step - 1] ? [{ t: 'thinking', c: AN.THOUGHTS[step - 1] }] : [])]);
      setStep(step + 1);
    }, step === 0 ? 500 : 1100);
    return () => clearTimeout(t);
  }, [step]);
  const labels = [...new Set(AN.STAGES.map(s => s.label))];
  const current = AN.STAGES[Math.min(step, AN.STAGES.length - 1)].label;
  const doneLabels = new Set(AN.STAGES.slice(0, step).map(s => s.label));
  if (step < AN.STAGES.length) doneLabels.delete(current);
  const pct = Math.round(step / AN.STAGES.length * 100);
  const icon = { info: 'info', tool_call: 'terminal-window', thinking: 'lightbulb' };
  return (
    <div>
      <PageHeader kicker="Analyst · Running" title={step >= AN.STAGES.length ? 'Report ready' : current + '…'} actions={<Button variant="outline" icon="stop" onClick={onCancel}>Cancel</Button>}>{question}</PageHeader>
      <div style={{ height: 4, background: 'var(--line)', marginBottom: 32, borderRadius: 2, overflow: 'hidden' }}><div style={{ width: pct + '%', height: '100%', background: 'var(--ink)', transition: 'width .4s var(--ease)' }} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'start' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="ecos-label">Stages</span>
          {labels.map(l => <RuleCheck key={l} status={doneLabels.has(l) ? 'pass' : 'pending'}><span style={{ fontWeight: l === current && step < AN.STAGES.length ? 600 : 400, color: l === current && step < AN.STAGES.length ? 'var(--ink)' : undefined }}>{l}</span></RuleCheck>)}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="ecos-label">Code-step budget</span>
            <div style={{ display: 'flex', gap: 4 }}>{Array.from({ length: AN.BUDGET }, (_, i) => <span key={i} style={{ flex: 1, height: 10, borderRadius: 1, background: i < step ? 'var(--ink)' : 'var(--line)' }} />)}</div>
            <span className="ecos-mono" style={{ fontSize: 13 }}>{step} / {AN.BUDGET} calls</span>
          </div>
        </section>
        <section style={{ gridColumn: 'span 2', minWidth: 0 }}>
          <div className="ecos-token" style={{ padding: 0, gap: 0, minHeight: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid color-mix(in oklab, var(--paper) 14%, var(--ink))' }}>
              <span style={{ font: '600 11px/1 var(--font-body)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--amber)' }}>Activity</span>
              <StatusBadge status={step >= AN.STAGES.length ? 'built' : 'ink'}>{step >= AN.STAGES.length ? 'Report saved' : 'Live'}</StatusBadge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
              {log.map((e, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: 12, padding: '8px 16px', alignItems: 'start' }}>
                  <Icon name={icon[e.t]} size={16} style={{ color: e.t === 'tool_call' ? 'var(--amber)' : 'color-mix(in oklab, var(--paper) 60%, var(--ink))', marginTop: 3 }} />
                  <span style={{ font: e.t === 'tool_call' ? '400 13px/21px var(--font-mono)' : '400 14px/22px var(--font-body)', color: e.t === 'thinking' ? 'color-mix(in oklab, var(--paper) 80%, var(--ink))' : 'var(--paper)', fontStyle: e.t === 'thinking' ? 'italic' : 'normal', wordBreak: 'break-word' }}>{e.c}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
window.ProgressScreen = ProgressScreen;