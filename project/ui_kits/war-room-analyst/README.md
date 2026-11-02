# War Room · Analyst (new feature)

An ECOS feature designed from the uploaded AI Studio app `uploads/ai-data-analyst` (Gemini Managed Agents CSV analyst). Keeps its behaviour and contracts, restyled and reframed for the War Room.

Mapped from source:
- **Data sources** — CSV upload (1 MB inline limit, multi-file relational), `gs://` Cloud Storage URI, sample datasets (`App.tsx` addFiles / addGcsUriFile).
- **Question** — the three `UPLOAD_EXAMPLES` prompts.
- **Agent progress** — stages from `stageFromCommand` (setup → load → profile → analyze → charts → report), activity log of `info / thinking / tool_call` entries (`ActivityLog`), and the 10-call execution budget from `agent/AGENTS.md`.
- **Report** — `AnalysisReport` schema: title, executive_summary, insights (metric/value), charts, tables, methodology, recommendations; PDF + slides export (jsPDF / Presentation in source); follow-up questions.
- **History** — past runs, including "limited" runs (limitations.csv path) and failed uploads.

ECOS additions: `analysis.run` capability shown in the app bar; POPIA check that blocks a run when columns look like personal information until they are excluded.

Charts are drawn in code from the report data for the mock; in production they are the agent's PNGs. All data is a labelled sample.

## Election results (drill-down + scenario model)
- **Drill-down** — municipality → ward → voting district. PR and ward ballot shares with change vs previous election, ward/VD table sortable by margin, turnout or swing, battleground flags, flipped wards. Municipality tabs: Battlegrounds, Swing diagnostic (ward-level Pearson r, labelled ecological), PR formula unpacked (Items 12–13, formula bar, full working table).
- **Scenario model** — per-party swing sliders, swing σ, turnout change; Monte Carlo over every ward, then Schedule 1 seat allocation per run. Outputs: majority / hung probabilities, council size, seat medians with 5–95% ranges, histogram, one-at-a-time sensitivity. Item 16 excessive seats are modelled and never capped.
- **Calculator checks** — NW405 2021 (Tier 2, real) and a synthesized Item 16 fixture run on load.
- **Tweaks** — runs, default σ, ward noise, Item 16 stress test, drill sort metric, battleground margin, provenance labels.
- Ward/VD results are invented for "Example Local Municipality (EX101)" and labelled as such. Seat logic: `election-data.js` (follows municipal-electoral-quota-config).
