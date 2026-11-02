function PageHeader({ kicker, title, children, actions }) {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 680 }}>
        <div className="ecos-label">{kicker}</div>
        <h2>{title}</h2>
        {children && <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: '25px' }}>{children}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}
window.PageHeader = PageHeader;