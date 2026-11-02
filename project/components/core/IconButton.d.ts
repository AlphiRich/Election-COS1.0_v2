export interface IconButtonProps {
  /** Phosphor icon name */
  icon: string;
  /** Required accessible label (also the title tooltip) */
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}