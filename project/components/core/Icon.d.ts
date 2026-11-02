export interface IconProps {
  /** Phosphor icon name, e.g. "shield-check", "key", "map-pin" */
  name: string;
  /** CSS size, e.g. 20 or "1.25em" */
  size?: number | string;
  /** Accessible label; omit for decorative icons */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}