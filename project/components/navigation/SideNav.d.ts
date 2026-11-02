/**
 * @startingPoint section="Navigation" subtitle="Ink War Room rail with Amber active marker" viewport="700x420"
 */
export interface SideNavProps {
  sections: Array<{ title?: string; items: Array<{ value: string; label: string; icon?: string; meta?: string }> }>;
  value: string;
  onChange?: (value: string) => void;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}