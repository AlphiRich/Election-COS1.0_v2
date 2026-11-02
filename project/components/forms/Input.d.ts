export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** md 40px desktop · lg 48px Field */
  size?: 'md' | 'lg';
  /** Plex Mono — for ward codes, IDs, amounts */
  mono?: boolean;
  invalid?: boolean;
}