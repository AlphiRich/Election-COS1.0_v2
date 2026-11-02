export interface RuleCheckProps {
  /** pass Green · fail deep-amber + semibold · pending Slate */
  status?: 'pass' | 'fail' | 'pending';
  children: React.ReactNode;
}