export interface CardProps {
  kicker?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  meta?: React.ReactNode;
  interactive?: boolean;
  /** Ink border + Amber top marker */
  selected?: boolean;
  /** Ink field with Paper text, Amber kicker */
  inverse?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}