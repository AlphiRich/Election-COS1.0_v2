export interface ToastProps {
  tone?: 'neutral' | 'success';
  children: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}