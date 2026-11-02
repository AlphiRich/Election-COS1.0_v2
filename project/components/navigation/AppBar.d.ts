export interface AppBarProps {
  title: React.ReactNode;
  crumbs?: React.ReactNode[];
  /** Right-side controls: tenant/municipality code, sync state, user */
  right?: React.ReactNode;
  style?: React.CSSProperties;
}