# War Room · Access console (RBAC)

Desktop ("War Room") settings surface for EC OS role-based access control, built from the `ecos-rbac-config` skill. Composes the system's components; screen files are lowercase so they are not bundled as library components.

Screens (left rail → Access):
- **Roles** — the six canonical roles from the `role` table, UI-label ↔ DB-key mapping, RLS reference counts, FINANCE_OFFICER seed note, WBS owner roles excluded.
- **Capabilities** — role × capability matrix (`role_capability`); click to cycle a cell; HQ fixed.
- **Delegations** — current/expiring/revoked grants; *Grant delegation* dialog evaluates the five non-negotiables live (can_delegate, held capability, in-scope VD, one level only, mandatory valid_until) and disables submit until all pass; revoke confirms the offline tradeoff.
- **Signing keys** — `rbac_signing_key` rotation (active → retiring → retired) with a sample signed capability token.
- **Audit log** — append-only `permission_audit_log`; grants, revocations and rotations made in the kit append here.

All people, IDs, VD numbers and dates are fictional. Overview / Wards / Seat calculator are intentionally empty (out of scope).
