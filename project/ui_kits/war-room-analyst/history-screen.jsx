function HistoryScreen({ runs, onOpen }) {
  const { Table, StatusBadge, CodeTag, Tabs, Input } = NS;
  const [tab, setTab] = React.useState('all');
  const [q, setQ] = React.useState('');
  const st = { done: ['built', 'Report'], limited: ['roadmap', 'Limited'], error: ['neutral', 'Failed'], running: ['info', 'Running'] };
  const rows = runs.filter(r => (tab === 'all' || r.status === tab) && (!q || (r.title + r.question + r.dataset).toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <PageHeader kicker="Analyst · History" title="Past analyses">Every run keeps its question, dataset, report and code-step count. Limited runs explain which data was missing.</PageHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
        <Tabs value={tab} onChange={setTab} tabs={[{ value: 'all', label: 'All', count: runs.length }, { value: 'done', label: 'Reports', count: runs.filter(r => r.status === 'done').length }, { value: 'limited', label: 'Limited' }, { value: 'error', label: 'Failed' }]} />
        <div style={{ width: 260, paddingBottom: 8 }}><Input placeholder="Search questions or datasets" value={q} onChange={e => setQ(e.target.value)} /></div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Table rowKey="id" onRowClick={r => r.status !== 'error' && onOpen(r)} columns={[
          { key: 'id', label: 'Run', render: r => <CodeTag plain>{r.id}</CodeTag> },
          { key: 'title', label: 'Finding', render: r => <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 460 }}><span style={{ fontWeight: 600 }}>{r.title}</span><span style={{ fontSize: 12, color: 'var(--slate)' }}>Q: {r.question}{r.followUps ? ' · ' + r.followUps + ' follow-up' : ''}</span></div> },
          { key: 'dataset', label: 'Dataset' },
          { key: 'when', label: 'Run at (SAST)', render: r => <span className="ecos-mono" style={{ fontSize: 13 }}>{r.when}</span> },
          { key: 'calls', label: 'Steps', numeric: true },
          { key: 'status', label: 'Status', render: r => <StatusBadge status={st[r.status][0]}>{st[r.status][1]}</StatusBadge> },
        ]} rows={rows} />
      </div>
    </div>
  );
}
window.HistoryScreen = HistoryScreen;