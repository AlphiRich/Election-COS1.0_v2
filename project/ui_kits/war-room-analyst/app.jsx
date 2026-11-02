function App() {
  const { SideNav, AppBar, StatusBadge, CodeTag, RoleBadge, Toast } = NS;
  const [tw, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const [view, setView] = React.useState(() => localStorage.getItem('ecos-analyst-view-v2') || 'drill');
  const [files, setFiles] = React.useState([]);
  const [question, setQuestion] = React.useState('');
  const [runs, setRuns] = React.useState(AN.HISTORY);
  const [open, setOpen] = React.useState(AN.HISTORY[0]);
  const [toast, setToast] = React.useState(null);
  React.useEffect(() => { if (view !== 'running') localStorage.setItem('ecos-analyst-view-v2', view); }, [view]);
  React.useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t); }, [toast]);
  const done = () => {
    const id = 'run_0' + (188 + runs.length - AN.HISTORY.length);
    const r = { id, title: AN.REPORT.title, question, dataset: files.length > 1 ? files.length + ' tables' : files[0].name, when: '2026-11-02 10:' + String(runs.length + 2).padStart(2, '0'), calls: AN.STAGES.length, status: 'done', followUps: 0 };
    setRuns(rs => [r, ...rs]); setOpen(r); setView('report'); setToast('Report saved · ' + id);
  };
  const followUp = q => { setQuestion(q); setFiles(f => f.length ? f : AN.SAMPLES[0].files); setView('running'); };
  const titles = { drill: 'Drill-down', scenario: 'Scenario model', new: 'New analysis', running: 'Running', report: 'Report', history: 'History' };
  const report = { ...AN.REPORT, question: open ? open.question : AN.REPORT.question, title: open ? open.title : AN.REPORT.title };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '248px minmax(0,1fr)', minHeight: '100vh' }}>
      <SideNav value={view === 'running' ? 'new' : view} onChange={v => view !== 'running' && setView(v)} style={{ position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' }}
        sections={[
          { title: 'Election results', items: [{ value: 'drill', label: 'Drill-down', icon: 'tree-structure' }, { value: 'scenario', label: 'Scenario model', icon: 'chart-scatter' }] },
          { title: 'Analyst', items: [{ value: 'new', label: 'New analysis', icon: 'magnifying-glass-plus' }, { value: 'report', label: 'Latest report', icon: 'chart-bar' }, { value: 'history', label: 'History', icon: 'clock-counter-clockwise', meta: String(runs.length) }] },
        ]}
        footer={<div style={{ fontSize: 12, lineHeight: '18px', color: 'var(--paper)', opacity: .7 }}>electioncos.co.za</div>} />
      <div style={{ minWidth: 0 }}>
        <AppBar crumbs={['War Room', view === 'drill' || view === 'scenario' ? 'Election results' : 'Analyst']} title={titles[view] || 'War Room'} right={<><StatusBadge status={view === 'running' ? 'info' : 'built'}>{view === 'running' ? 'Agent running' : 'Ready'}</StatusBadge><CodeTag>{EL.MUNI.code}</CodeTag><RoleBadge role="LOCAL_HEAD" /></>} />
        <main style={{ maxWidth: 1200, padding: '40px 40px 96px', boxSizing: 'border-box' }}>
          {view === 'drill' && <DrillScreen tw={tw} />}
          {view === 'scenario' && <ScenarioScreen tw={tw} />}
          {view === 'new' && <NewAnalysisScreen files={files} setFiles={setFiles} question={question} setQuestion={setQuestion} onRun={() => setView('running')} />}
          {view === 'running' && <ProgressScreen question={question} files={files} onDone={done} onCancel={() => setView('new')} />}
          {view === 'report' && <ReportScreen report={report} run={open} onFollowUp={followUp} onToast={setToast} />}
          {view === 'history' && <HistoryScreen runs={runs} onOpen={r => { setOpen(r); setView('report'); }} />}
        </main>
      </div>
      {toast && <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 60 }}><Toast tone="success" onDismiss={() => setToast(null)}>{toast}</Toast></div>}
      <TweaksPanel>
        <TweakSection label="Scenario model" />
        <TweakRadio label="Runs" value={tw.runs} options={['500', '1000', '5000']} onChange={v => setTweak('runs', v)} />
        <TweakSlider label="Default swing σ" value={tw.sigma} min={0} max={6} step={0.5} unit=" pp" onChange={v => setTweak('sigma', v)} />
        <TweakSlider label="Ward-level noise" value={tw.wardNoise} min={0} max={5} step={0.5} unit=" pp" onChange={v => setTweak('wardNoise', v)} />
        <TweakToggle label="Split-ticket stress (Item 16)" value={tw.stressItem16} onChange={v => setTweak('stressItem16', v)} />
        <TweakSection label="Drill-down" />
        <TweakRadio label="Sort wards by" value={tw.drillMetric} options={['Margin', 'Turnout', 'Swing']} onChange={v => setTweak('drillMetric', v)} />
        <TweakSlider label="Battleground margin" value={tw.battleground} min={2} max={15} step={1} unit=" pp" onChange={v => setTweak('battleground', v)} />
        <TweakSection label="Display" />
        <TweakToggle label="Data provenance labels" value={tw.provenance} onChange={v => setTweak('provenance', v)} />
      </TweaksPanel>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);