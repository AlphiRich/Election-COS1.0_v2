export type EcosRole = 'HQ_ADMIN' | 'LOCAL_HEAD' | 'FINANCE_OFFICER' | 'WARD_LEAD' | 'VD_CAPTAIN' | 'VOLUNTEER';
export interface RoleBadgeProps {
  /** One of the six canonical roles in the `role` table */
  role: EcosRole;
  /** Also show the DB enum key in Plex Mono */
  showKey?: boolean;
}