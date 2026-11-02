function fmtSize(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
function NewAnalysisScreen({ files, setFiles, question, setQuestion, onRun }) {
  const { Button, Field, Input, Alert, CodeTag, Icon, StatusBadge, IconButton, Tabs } = NS;
  const [src, setSrc] = React.useState('upload');
  const [over, setOver] = React.useState(false);
  const [gcs, setGcs] = React.useState('');
  const [err, setErr] = React.useState(null);
  const add = list => {
    const csv = list.filter(f => /\.csv$/i.test(f.name));
    const big = csv.filter(f => f.size > AN.INLINE_MAX);
    if (big.length) { setErr(big.map(f => f.name + ' (' + fmtSize(f.size) + ')').join(', ') + ' exceeds the 1 MB inline limit. Use a Cloud Storage URI instead.'); return; }
    setErr(null);
    setFiles(fs => { const m = new Map(fs.map(f => [f.name, f])); csv.forEach(f => m.set(f.name, { name: f.name, size: f.size, origin: 'upload' })); return [...m.values()]; });
  };
  const addGcs = () => {
    const u = gcs.trim();
    if (!u.startsWith('gs://')) { setErr('GCS URI must start with gs:// — e.g. gs://bucket-name/large_dataset.csv'); return; }
    const n = u.split('/').pop() || 'dataset.csv';
    setErr(null); setFiles(fs => [...fs.filter(f => f.name !== n), { name: /\.csv$/i.test(n) ? n : n + '.csv', uri: u, origin: 'gcs' }]); setGcs('');
  };
  const pii = files.flatMap(f => (f.pii || []).map(c => [f.name, c]));
  const canRun = files.length > 0 && question.trim() && !pii.length;
  return (
    <div>
      <PageHeader kicker="Analyst · New analysis" title="Ask a question of your data">Upload one CSV or several related tables. The analyst profiles every file, runs the analysis in a sandbox and returns a report with charts. Every number comes from your data.</PageHeader>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 40, alignItems: 'start' }}>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}><span className="ecos-mono" style={{ color: 'var(--slate)' }}>01</span><h4>Data sources</h4></div>
          <Tabs value={src} onChange={setSrc} tabs={[{ value: 'upload', label: 'Upload CSV' }, { value: 'gcs', label: 'Cloud Storage URI' }, { value: 'sample', label: 'Sample datasets' }]} />
          {src === 'upload' && (
            <label onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={e => { e.preventDefault(); setOver(false); add([...e.dataTransfer.files]); }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '36px 24px', border: '1.5px dashed ' + (over ? 'var(--blue)' : 'var(--line-strong)'), background: over ? 'var(--blue-tint)' : 'var(--paper-raised)', borderRadius: 4, cursor: 'pointer', textAlign: 'center' }}>
              <Icon name="file-csv" size={32} style={{ color: 'var(--blue)' }} />
              <span style={{ fontWeight: 600 }}>Drop CSV files here, or browse</span>
              <span style={{ fontSize: 12, color: 'var(--slate)' }}>Up to 1 MB per file inline · larger files via Cloud Storage</span>
              <input type="file" accept=".csv" multiple style={{ display: 'none' }} onChange={e => add([...e.target.files])} />
            </label>
          )}
          {src === 'gcs' && (
            <Field label="Cloud Storage URI" hint="For CSV files over 1 MB. The analyst reads the object directly." htmlFor="gcs">
              <div style={{ display: 'flex', gap: 8 }}><Input id="gcs" mono placeholder="gs://bucket-name/large_dataset.csv" value={gcs} onChange={e => setGcs(e.target.value)} onKeyDown={e => e.key === 'Enter' && addGcs()} /><Button variant="outline" onClick={addGcs}>Add</Button></div>
            </Field>
          )}
          {src === 'sample' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {AN.SAMPLES.map(s => (
                <button key={s.id} className="ecos-card ecos-card--interactive" style={{ textAlign: 'left', padding: 16, font: 'inherit', color: 'inherit' }} onClick={() => { setErr(null); setFiles(s.files.map(f => ({ ...f, origin: 'sample' }))); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}><span style={{ fontWeight: 600 }}>{s.name}</span><StatusBadge status="neutral">{s.files.length} table{s.files.length > 1 ? 's' : ''}</StatusBadge></div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{s.files.map(f => <CodeTag key={f.name}>{f.name}</CodeTag>)}</div>
                </button>
              ))}
            </div>
          )}
          {err && <Alert tone="warning" title="Can't add that file">{err}</Alert>}
          {files.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="ecos-label" style={{ paddingBottom: 8, borderBottom: '2px solid var(--ink)' }}>Staged · {files.length} file{files.length > 1 ? 's' : ''}</div>
              {files.map(f => (
                <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                  <Icon name={f.origin === 'gcs' ? 'cloud' : 'file-csv'} size={20} style={{ color: 'var(--slate)' }} />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <CodeTag plain>{f.name}</CodeTag>
                    <span style={{ fontSize: 12, color: 'var(--slate)' }}>{f.uri ? f.uri : [f.size && fmtSize(f.size), f.rows && f.rows.toLocaleString('en-ZA') + ' rows', f.keys && 'keys: ' + f.keys.join(', ')].filter(Boolean).join(' · ')}</span>
                  </div>
                  <IconButton icon="x" label={'Remove ' + f.name} size="sm" onClick={() => setFiles(fs => fs.filter(x => x.name !== f.name))} />
                </div>
              ))}
            </div>
          )}
          {pii.length > 0 && <Alert tone="critical" title="Personal information detected" action={<Button size="sm" variant="ink" onClick={() => setFiles(fs => fs.map(f => ({ ...f, pii: undefined, excluded: f.pii })))}>Exclude columns</Button>}>
            {pii.map(([f, c]) => <CodeTag key={f + c} inverse>{c}</CodeTag>)} in {pii[0][0]} look like personal information. Exclude them, or confirm a lawful basis under POPIA, before analysis.</Alert>}
        </section>
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}><span className="ecos-mono" style={{ color: 'var(--slate)' }}>02</span><h4>Your question</h4></div>
          <textarea className="ecos-input" rows={5} value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g. What changed month on month, and why?" style={{ height: 'auto', padding: 12, lineHeight: '22px', resize: 'vertical', fontSize: 15 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="ecos-label">Try</span>
            {AN.EXAMPLES.map(q => <button key={q} onClick={() => setQuestion(q)} className="ecos-btn ecos-btn--ghost" style={{ justifyContent: 'flex-start', height: 'auto', padding: '8px 10px', whiteSpace: 'normal', textAlign: 'left', fontWeight: 400, lineHeight: '20px' }}><NS.Icon name="arrow-bend-down-right" />{q}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            <Button icon="play" disabled={!canRun} onClick={onRun}>Run analysis</Button>
            <span style={{ fontSize: 12, color: 'var(--slate)' }}>{!files.length ? 'Add at least one CSV' : !question.trim() ? 'Write a question' : pii.length ? 'Resolve personal information first' : 'Runs in a sandbox · up to ' + AN.BUDGET + ' code steps'}</span>
          </div>
        </section>
      </div>
    </div>
  );
}
window.NewAnalysisScreen = NewAnalysisScreen;