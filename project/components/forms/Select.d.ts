export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: Array<string | { value: string; label: string; disabled?: boolean }>;
  size?: 'md' | 'lg';
}