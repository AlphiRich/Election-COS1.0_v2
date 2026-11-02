export interface TabsProps {
  tabs: Array<{ value: string; label: React.ReactNode; count?: number }>;
  value: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}