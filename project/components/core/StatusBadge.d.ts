export interface StatusBadgeProps {
  /** built = Green (delivered/complete/active); roadmap = deep amber #8A6A2A (planned/in progress/expiring); info = Blue; neutral = Slate; ink = inverse; outline */
  status?: 'built' | 'roadmap' | 'info' | 'neutral' | 'ink' | 'outline';
  dot?: boolean;
  /** Short uppercase-able label: BUILT, ROADMAP, ACTIVE, REVOKED */
  children: React.ReactNode;
}