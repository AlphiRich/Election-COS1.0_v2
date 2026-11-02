export interface AlertProps {
  /** info Blue · success Green · warning deep-amber · critical Ink field with Amber glyph */
  tone?: 'info' | 'success' | 'warning' | 'critical';
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  /** Override Phosphor icon */
  icon?: string;
}