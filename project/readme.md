# Election-COS 1.0 — Design System

**Election Campaign Operating System 1.0** (ECOS / EC OS) · electioncos.co.za · *Democracy Through Computational Intelligence*

A civic campaign-operations platform for South African local elections: a desktop **War Room** for Party HQ and Local Election Heads (seat calculators, ward overviews, access control) and an offline-first **Field** app for canvassers working in poor-signal areas. Operated by Innovation Consult (Pty) Ltd. The regulatory context — POPIA, IEC mandates, the Political Party Funding Act — shapes the product and its copy.

## Sources
- `uploads/Copy of design_system_protocol.md.pdf` — *Election-COS 1.0 Design System Protocol* (brand essence, palette, WCAG rules, type, layout, imagery, logo usage). Primary source for every token.
- Canva folder **"Election CampaignOS1.0"** (id `FAHZcUUkx6M`): `marketing_asset_architecture.md` (DAHZeVxSZFc), `election_cos_marketing_strategy.md` (DAHZeZ244gA), image "Visually Striking Page Design.png" (MAHZebCAONQ, not importable). Used for voice, copy and CTA treatments.
- Skill `ecos-rbac-config` — six canonical roles, capability model, one-level delegation, signed short-lived capability tokens, append-only permission audit log. Drives the RBAC components and both UI kits. Its `references/schema.sql` and `references/api-contract.md` were not available.
- Bound visual reference: Broadsheet design system — its paper-and-ink, whitespace-over-boxes philosophy carries over; its colours and type do **not** (the ECOS protocol overrides them).

## Index
- `styles.css` — entry point (imports only) → `tokens/fonts.css`, `icons.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`, `components/ecos.css`
- `guidelines/` — 16 foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives, each `.jsx` + `.d.ts` + `.prompt.md`, one card per folder
  - core: Icon, Button, IconButton, StatusBadge, CodeTag, Card, Wordmark
  - forms: Field, Input, Select, Checkbox, Radio, Switch
  - feedback: Alert, Toast, Dialog, Tooltip
  - navigation: Tabs, SideNav, AppBar
  - data: Table, Stat
  - rbac: RoleBadge, CapabilityCell, RuleCheck, CapabilityToken
- `ui_kits/war-room-rbac/` — desktop Access console: Roles, Capabilities, Delegations, Signing keys, Audit log
- `ui_kits/war-room-analyst/` — new feature from the uploaded AI Data Analyst app: CSV sources, question, agent progress, report with charts, history
- `ui_kits/field-app/` — mobile canvasser authorisation: token, scoped households, POPIA capture, revocation on sync
- `components/ecos-loader.js` — preview loader: compiles the component sources in-browser into `window.ECOS` so cards and kits run before the compiled `_ds_bundle.js` exists. Consumers should use the bundle.
- `templates/covers/` — print-ready A4 report covers, each a front + back pair (`doc-page`, explicit pagination; export to PDF per file). Shared styles in `covers.css`.
  - `cover-01-research-report.html` — the supplied Canva cover, content edited: placeholder "REPORT COVER" → document class "RESEARCH REPORT", metadata fields filled, document code year 2024 → 2026, tagline moved from Amber to Roadmap text (Amber on Paper fails WCAG)
  - `cover-02-war-room-briefing.html` — full Ink field, Amber rule, four-up metadata
  - `cover-03-ward-data-pack.html` — Ink masthead band, 12-col grid, giant Plex Mono ward code, ledger table
  - `cover-04-compliance-handbook.html` — Ink spine panel, Amber seam, statutes ledger
  - `cover-05-field-guide.html` — full-bleed photo slot (drop an authentic civic photo) over Ink panel
  - Every back cover: WhatsApp QR (wa.me/27824497310 · 082 449 7310), P. O. Box 2590, Potchefstroom, 2520, info@electioncos.co.za, electioncos.co.za with its own QR beside the URL, disclaimer and copyright notice.
- `assets/qr/` — generated QR codes (Ink on white, 4-module quiet zone): `whatsapp-27824497310.svg`, `electioncos-co-za.svg`. Always keep QR codes dark-on-light, ≥ 18 mm printed.
- `SKILL.md` — Agent Skill wrapper

**Intentional additions** (no component inventory was supplied, so a standard set sized to ECOS was authored): `Icon` wraps Phosphor; `CodeTag` enforces Plex Mono for identifiers; `Wordmark` is a type-only stand-in for the unsupplied symbol; the `rbac/` group encodes the ecos-rbac-config model.

## PRINT COVERS
- A4, full-bleed. Document class is the headline (Research Report, War Room Briefing, Ward Data Pack, Compliance Handbook, Canvasser Field Guide); specifics live in the metadata block.
- Document codes: `ECO-DOC-NNNN-TYPE-YYYY` in Plex Mono (RPT report · BRF briefing · DAT data pack · CMP compliance · FLD field).
- Back covers always carry the standard contact block, disclaimer and copyright — edit wording in one place by updating all five files together.

## CONTENT FUNDAMENTALS
- **Voice:** authoritative, calm, precise, empowering, politically neutral. A seasoned news anchor, not a campaigner.
- **Short declaratives.** "Data is fragmented. Compliance is strict. The election is won on the ground." Taglines: "Comply before you campaign." · "Every case, followed through." · "Take the War Room to the Streets."
- **Headline case:** sentence case in UI; title case allowed for campaign headlines. System labels uppercase with tracking: BUILT, ROADMAP, ACTIVE, REVOKED.
- **Address:** second person ("your ward", "your canvassers") in marketing and UI; system states in third person ("Enforced on next sync").
- **Specific, not vague:** cite the real thing — ward codes (NW405-W07), VD numbers, capability keys (`household.write`), Rand figures (R1,800/ward), thresholds (R200k disclosure). Always set these in IBM Plex Mono.
- **Regulatory honesty:** name the law (POPIA, PPFA, IEC), name the tradeoff ("cached token stays valid until expiry; revocation is enforced on reconnect"). Never overclaim.
- **Neutral:** never personalise politics, never name or colour-code a party, no candidate faces. Paid-media disclaimers where required ("Paid for by Innovation Consult (Pty) Ltd").
- **South African English:** authorise, colour, programme; SAST timestamps; en-ZA.
- **No emoji.** No exclamation marks in product UI.

## VISUAL FOUNDATIONS
- **Aesthetic:** a "paper and ink" civic document — clean, exact, strategic highlights. Paper ground, Ink type, one Amber action per view.
- **Colour:** eight approved colours only (Ink #1A2246, Paper #F7F4EE, Amber #B7913F, Slate #6A6E7E, Blue #33427E, Green #2F7E4A, Roadmap #8A6A2A, Line #DCD6C8). "Don't add new colours" — hovers/tints are `color-mix()` steps of these. **No red**: party-colour signifiers are prohibited, so critical states use an Ink field with an Amber glyph and warnings use Roadmap text.
- **Contrast (mandatory):** Ink on Paper 14.05:1 for body; Amber on Ink 5.24:1 for dark CTAs/markers; Amber on Paper 2.68:1 — **never** text or vital UI. Primary button = Amber fill + Ink label (5.24:1). Focus ring is Blue on Paper, Amber on Ink.
- **Type:** Archivo 700 for display (H1 48/52, H2 32/36, H3 24/30); Public Sans 400/600 body at 1.65 (16/26, 14/23, 12/20); IBM Plex Mono exclusively for IDs, codes and figures (14/22, tabular).
- **Layout:** War Room — 12 columns, 24px gutter, max 1,200px, dense tables, Ink left rail. Field — single column, 48px minimum touch targets, full-width controls.
- **Backgrounds:** flat Paper. No gradients, textures or patterns. Ink fields for rails, tokens, toasts, critical alerts and footers. Promo pieces may use a dark Ink field with Amber/Blue data-vis.
- **Imagery:** authentic, diverse South African civic settings; people in natural, respectful civic work. No stock clichés (ballot boxes), no party logos, no candidate faces. Product proof = crisp, high-contrast vector mockups of the dashboard.
- **Borders:** hairline Line (#DCD6C8) — "borders only". Table headers get a 2px Ink rule. Structure otherwise comes from whitespace.
- **Corners:** 2px controls, 4px cards/dialogs. Never pill-shaped buttons.
- **Shadows:** almost none. `--shadow-2` for floating menus, `--shadow-3` for dialogs/toasts only.
- **Cards:** raised paper, hairline border, 4px radius, no shadow; selected = Ink border + 3px Amber top inset. Discrete items only, never layout.
- **Accent marks:** a thin Amber line is the signature — active nav marker, tab underline, toast top edge, invalid-field inset, video lower-third top border.
- **Hover:** fills shift one mixed step (Amber lightens toward Paper, Blue/Ink darken); outline/ghost gain an Ink or Blue tint. **Press:** one step deeper. No scale/shrink.
- **Disabled:** 45% opacity, no pointer.
- **Motion:** minimal and functional — 120–180ms colour/opacity transitions, `cubic-bezier(.2,.6,.2,1)`. No bounces. Video: kinetic typography into smooth UI recordings.
- **Transparency/blur:** only the dialog overlay (Ink 55%) and semi-transparent Ink lower-thirds in video. No backdrop blur.

## ICONOGRAPHY
- No icon set was supplied. **Substitution:** Phosphor Icons, duotone weight, loaded from CDN (`@phosphor-icons/web@2.1.1`) via `tokens/icons.css`; use `<Icon name="shield-check" />` or `<i class="ph-duotone ph-shield-check">`. Inherits `currentColor` — Ink by default, Blue for informational, Green/Roadmap for status, Amber only on Ink.
- Core glyphs: shield-check, key, users-three, handshake, map-pin, map-trifold, identification-card, seal-check, lock-simple, scroll, clock-countdown, wifi-slash, house-line, calculator.
- No emoji, no unicode-as-icon, no ballot-box or flag motifs.
- **Logo:** the protocol defines Primary, Compact and Monochrome symbol lockups (min 24px / 20mm symbol, 120px / 25mm horizontal lockup, clearspace X) but no artwork file was supplied. `Wordmark` sets "Election-COS 1.0" in Archivo as a placeholder — **never redraw the symbol**; drop the approved files into `assets/`.
