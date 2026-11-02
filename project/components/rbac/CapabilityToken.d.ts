/**
 * @startingPoint section="RBAC" subtitle="Offline-verifiable signed capability token" viewport="700x340"
 */
export interface CapabilityTokenProps {
  sub: string;
  tenant: string;
  /** Resolved at issuance: role defaults + active delegations */
  capabilities: string[];
  /** Ward / VD codes the token is valid within */
  scope: string[];
  issued: string;
  expires: string;
  /** rbac_signing_key id */
  kid: string;
  /** 0–1 lifetime remaining (Amber meter) */
  remaining?: number;
  status?: 'valid' | 'expiring' | 'revoked' | 'expired';
  style?: React.CSSProperties;
}