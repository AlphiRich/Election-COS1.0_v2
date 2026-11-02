export interface CapabilityCellProps {
  /** granted = Ink filled; scoped = Blue tint (geographic scope applies); none = dash */
  state?: 'granted' | 'scoped' | 'none';
  /** Amber underline — the holder may delegate this capability */
  delegable?: boolean;
  onClick?: () => void;
  label?: string;
}