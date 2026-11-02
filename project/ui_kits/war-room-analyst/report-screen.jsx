function BarChart({ data, unit }) {
  const max = Math.max(...data.map(d => d[1]));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map(([k, v], i) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: '96px 1fr 56px', gap: 12, alignItems: 'center', fontSize: 13 }}>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k}</span>
          <div style={{ height: 18, background: 'var(--ink-tint)' }}><div style={{ width: (v / max * 100) + '%', height: '100%', background: i < 2 ? 'var(--blue)' : 'var(--slate)' }} /></div>
          <span className="ecos-mono" style={{ fontSize: 12, textAlign: 'right' }}>{v.toFixed(2)}</span>
        </div>
      ))}
      <span style={{ fontSize: 12, color: 'var(--slate)' }}>{unit}</span>
    </div>
  );
}
function LineChart({ data }) {
  const W = 480, H = 180, P = 24, max = Math.max(...data) * 1.1;
  const pts = data.map((v, i) => [P + i * (W - P * 2) / (data.length - 1), H - P - v / max * (H - P * 2)]);
  const avg = data.reduce((a, b) => a + b, 0) / data.length, ay = H - P - avg / max * (H - P * 2);
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  return (
    <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Monthly revenue line chart">
      <line x1={P} x2={W - P} y1={H - P} y2={H - P} stroke="var(--line-strong)" />
      <line x1={P} x2={W - P} y1={ay} y2={ay} stroke="var(--slate)" strokeDasharray="3 4" />
      <text x={W - P} y={ay - 6} textAnchor="end" fontSize="11" fill="var(--slate)" fontFamily="var(--font-mono)">avg {avg.toFixed(2)}</text>
      <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke="var(--blue)" strokeWidth="2.5" />
      {pts.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r={i >= 10 ? 4.5 : 3} fill={i >= 10 ? 'var(--ink)' : 'var(--blue)'} /><text x={p[0]} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--slate)" fontFamily="var(--font-mono)">{months[i]}</text></g>)}
    </svg>
  );
}
function ReportScreen({ report, run, onFollowUp, onToast }) {
  const { Button, Stat, Table, CodeTag, StatusBadge, Icon, Alert } = NS;
  const [fq, setFq] = React.useState('');
  const r = report;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <StatusBadge status="built">Report</StatusBadge><CodeTag>{run.id}</CodeTag><span style={{ fontSize: 13, color: 'var(--slate)' }}>{r.dataset_name} · {run.calls} code steps · {r.generated_at}</span>
      </div>
      <PageHeader kicker={'Q · ' + r.question} title={r.title}
        actions={<><Button variant="outline" icon="file-pdf" onClick={() => onToast('PDF exported · ' + run.id + '.pdf')}>Export PDF</Button><Button variant="outline" icon="presentation-chart" onClick={() => onToast('Slides exported · ' + run.id + '.pptx')}>Slides</Button></>} />
      <p style={{ fontSize: 18, lineHeight: '30px', maxWidth: 760, marginTop: -8, marginBottom: 40 }}>{r.executive_summary}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, paddingBottom: 32, borderBottom: '1px solid var(--line)', marginBottom: 40 }}>
        {r.insights.map(i => (
          <div key={i.title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Stat label={i.metric} value={i.value} />
            <div style={{ fontWeight: 600, fontSize: 15 }}>{i.title}</div>
            <p style={{ fontSize: 13, lineHeight: '21px', color: 'var(--slate)' }}>{i.detail}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 40, marginBottom: 48 }}>
        <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <h4>Revenue by category</h4>
          <BarChart data={r.byCategory} unit="Revenue, R millions · 12 months" />
          <figcaption style={{ fontSize: 12, color: 'var(--slate)' }}>charts/revenue_by_category.png · bar</figcaption>
        </figure>
        <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <h4>Monthly revenue</h4>
          <LineChart data={r.monthly} />
          <figcaption style={{ fontSize: 12, color: 'var(--slate)' }}>charts/monthly_revenue.png · line · R millions · November–December highlighted</figcaption>
        </figure>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 40, marginBottom: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <h4>{r.table.title}</h4>
          <div style={{ overflowX: 'auto' }}><Table dense columns={r.table.columns.map((c, i) => ({ key: String(i), label: c, numeric: i >= 2, render: row => i === 1 ? <span style={{ color: 'var(--slate)' }}>{row[i]}</span> : row[i] }))} rows={r.table.rows} /></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4>Recommendations</h4>
            <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, lineHeight: '23px' }}>{r.recommendations.map(x => <li key={x}>{x}</li>)}</ol>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="ecos-label">Methodology</span>
            <p style={{ fontSize: 13, lineHeight: '21px', color: 'var(--slate)' }}>{r.methodology}</p>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 760 }}>
        <h4>Ask a follow-up</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="ecos-input" value={fq} onChange={e => setFq(e.target.value)} onKeyDown={e => e.key === 'Enter' && fq.trim() && onFollowUp(fq)} placeholder="e.g. Break the Q4 peak down by product" />
          <Button icon="arrow-right" disabled={!fq.trim()} onClick={() => onFollowUp(fq)}>Ask</Button>
        </div>
        <span style={{ fontSize: 12, color: 'var(--slate)' }}>Follow-ups reuse the profiled data and replace this run's charts.</span>
      </div>
    </div>
  );
}
window.ReportScreen = ReportScreen;