export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Error replaces hint; rendered Ink semibold with Amber warning glyph (never Amber text) */
  error?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}