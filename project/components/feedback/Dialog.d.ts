export interface DialogProps {
  open?: boolean;
  title: React.ReactNode;
  kicker?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons, right-aligned in the sunk footer */
  actions?: React.ReactNode;
  onClose?: () => void;
  width?: number;
  /** Render without backdrop (for specimens) */
  inline?: boolean;
}