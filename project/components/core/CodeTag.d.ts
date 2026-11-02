export interface CodeTagProps {
  /** A ward code (NW405-W07), VD number, IEC tracking ID, capability key or Rand figure */
  children: React.ReactNode;
  plain?: boolean;
  inverse?: boolean;
  title?: string;
}