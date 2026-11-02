/**
 * @startingPoint section="Core" subtitle="Amber primary, Blue secondary, outline, ghost, Ink and destructive" viewport="700x260"
 */
export interface ButtonProps {
  /** primary = Amber fill + Ink label (main CTA); secondary = Blue + Paper; outline; ghost (Blue text); ink (on Paper, inverse emphasis); destructive (revoke/rotate) */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'ink' | 'destructive';
  /** sm 32px · md 40px (War Room) · lg 48px (Field touch target) */
  size?: 'sm' | 'md' | 'lg';
  /** Phosphor icon name before label */
  icon?: string;
  iconRight?: string;
  block?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}