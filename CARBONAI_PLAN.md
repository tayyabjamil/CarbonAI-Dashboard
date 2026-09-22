# CarbonAI Dashboard Redesign — Implementation Plan

---

## 0. The Brief in One Sentence
An internal analyst tool that lets someone scan 14 carbon projects, spot what needs attention, and drill into detail — currently functional but visually broken and data-inconsistent.

---

## 1. Stack Decision: Stay Single-File HTML

**Decision:** Keep it as one `.html` file.

**Why:**
- No setup friction for the reviewer — open and run, no `npm install`
- Bring Chart.js via CDN (`<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js">`)
- Bring Inter font via Google Fonts link
- Demonstrates CSS architecture discipline without a build tool as a crutch

**If pressed in the interview about React:**
> "I'd reach for Vite + React if the data were dynamic or the component tree got deep. For 14 static records and two charts, a framework would add setup overhead with no user-facing benefit. The constraint here was clarity and craft, not scaffold size."

---

## 2. Data Problems to Fix in JavaScript (Not in the Source Array)

The `projects` array has inconsistent raw values. Write normalisation helpers that derive clean display values *without touching the source data*.

| Field    | Problem                                                  | Fix                                                        |
|----------|----------------------------------------------------------|------------------------------------------------------------|
| `volume` | "120,000 tCO2e", "85 kt", "45000", "12,400"             | `parseVolume(v)` → always returns a number in tCO2e        |
| `price`  | "$12.50", "£9.80", "€11.00/tCO2e", "18", "9.50"         | `parsePrice(v)` → `{ amount, currency }` for display       |
| `rating` | Mix of numbers (82), letter grades ("B+", "A-"), "pending", null | `normaliseRating(r)` → `{ score: 0–100, tier, label }` |
| `registry` | "verra" vs "Verra", "American Carbon Registry" vs "ACR" | `normaliseRegistry(r)` → canonical display string         |
| `updated` | "2024-03-01", "03/14/2024", "14 Mar 2024", "March 2024" | `parseDate(d)` → ISO string for sorting, formatted for display |
| `vintage` | "'23" vs "2023" vs "2021-2023"                          | Leave as-is for display, parse start year for sorting      |

### Rating normalisation map
```
number (0–100)  → use directly
"A"             → 93
"A-"            → 88
"B+"            → 77
"C"             → 52
"pending"       → { tier: "pending" }
null            → { tier: "unrated" }
```

### Risk tiers (used for badges, chart, and sort order)
- **High confidence** : score ≥ 80 → green
- **Medium**          : score 60–79 → amber
- **Low**             : score < 60 → red
- **Unrated/Pending** : null or "pending" → grey

---

## 3. Design System

### Colour tokens
```css
--color-bg:          #f0f4f2;   /* page background, off-white green tint */
--color-surface:     #ffffff;
--color-border:      #e5e7eb;

--color-green-900:   #0c3d2e;   /* header, primary brand */
--color-green-700:   #15573f;
--color-green-500:   #1e8a5e;   /* primary action, high-confidence badge */
--color-green-100:   #e8f5f0;   /* high-confidence badge background */

--color-amber-600:   #d97706;   /* medium risk text */
--color-amber-500:   #f59e0b;   /* medium risk dot, attention indicator */
--color-amber-100:   #fef3c7;   /* medium risk badge background */

--color-red-600:     #dc2626;   /* low risk text */
--color-red-500:     #ef4444;   /* low risk dot */
--color-red-100:     #fee2e2;   /* low risk badge background */

--color-gray-900:    #111827;
--color-gray-700:    #374151;
--color-gray-500:    #6b7280;
--color-gray-400:    #9ca3af;
--color-gray-200:    #e5e7eb;
--color-gray-100:    #f3f4f6;
--color-gray-50:     #f9fafb;
```

### Typography
- **Font:** Inter (Google Fonts) — professional, data-dense, legible at 12px
- **Scale:**
  - Page title: 20px / 700
  - Section label: 11px / 600 / uppercase / 0.08em tracking
  - Table header: 11px / 600 / uppercase
  - Body / table row: 13px / 400
  - KPI value: 28px / 700
  - Badge / chip: 11–12px / 500

### Spacing
- Page padding: `28px 40px`
- Card padding: `20px 24px`
- Card gap: `16px`
- Table cell padding: `12px 16px`

### Border radius
- Cards / filter bar: `8px`
- Badges: `12px` (pill)
- Type chips: `4px`
- Buttons: `4px`

---

## 4. Layout Hierarchy

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER  │ CarbonAI logo  │ "Portfolio Dashboard"  │ Export CSV   │
├──────────────────────────────────────────────────────────────────┤
│ KPI STRIP  │ 14 Projects │ 714.8 KtCO2e │ Avg Rating: 74 │ ⚠ 4  │
├───────────────────────────┬──────────────────────────────────────┤
│  RISK DISTRIBUTION        │  VOLUME BY PROJECT TYPE              │
│  (donut — 4 tiers)        │  (horizontal bar — 6 types)          │
│  180px tall               │  200px tall                          │
├───────────────────────────┴──────────────────────────────────────┤
│ FILTER BAR  │ 🔍 Search all fields  │ Type ▾ │ Registry ▾ │ Risk ▾│
├──────────────────────────────────────────────────────────────────┤
│ PROJECT TABLE (all columns sortable)                             │
│  ID · Name · Type · Country · Registry · Vintage · Volume ·     │
│  Price · Rating · Updated · Notes (truncated, expand on click)  │
└──────────────────────────────────────────────────────────────────┘
│ FOOTER  │ © 2026 CarbonAI. Internal use only.  │ carbonai.eco   │
```

**Hierarchy reasoning for the interview:**
- KPIs first → analyst confirms they're looking at the right portfolio (size, volume, flags)
- Charts second → pattern recognition before detail (which types dominate? is the risk spread healthy?)
- Filter + table third → drill-down after the overview lands

---

## 5. KPI Cards

| Card | Value | Derived how |
|------|-------|-------------|
| Total Projects | 14 | `projects.length` |
| Portfolio Volume | 714.8 KtCO₂e | sum of `parseVolume` across all 14 |
| Avg. Confidence Score | e.g. 74 | mean of numeric scores (exclude pending/unrated) |
| Needs Attention | 4 | projects where tier is "low", "pending", or "unrated" |

The "Needs Attention" card gets an amber left-border accent to draw the eye.

---

## 6. Charts

### Chart A — Risk Distribution (Donut, left column, narrower)
- **4 segments:** High confidence (green) / Medium (amber) / Low (red) / Unrated/Pending (grey)
- **Centre label:** total project count
- Chart.js `type: 'doughnut'`
- Keep it simple — no animation tweaks needed

**Why a donut over a bar?**
> "Ratio of 4 categories with no time axis → part-to-whole read. A bar here would imply ranking that isn't meaningful."

### Chart B — Volume by Project Type (Horizontal Bar, right column)
- X-axis: tCO2e volume
- Y-axis: REDD+, ARR, Mangrove, Biochar, Soil C, DAC
- Sorted descending so the dominant type (REDD+) sits at top
- Chart.js `type: 'bar'` with `indexAxis: 'y'`
- Colour each bar by a neutral green palette (not the risk colours — different dimension)

**Why horizontal not vertical?**
> "Type labels are long — horizontal avoids the 45° rotation hack and is easier to scan down a list."

**What was dropped and why:**
> "The price-vs-rating scatter was tempting but with only 14 points and mixed currencies it would be misleading. A table column communicates individual prices more honestly."

---

## 7. Table

### Column order
`ID · Name · Type · Country · Registry · Vintage · Volume · Price · Rating · Updated · Notes`

(Original had notes as column 2 and name as column 11 — inverted from what an analyst needs)

### Sorting
- All columns sortable — click header to toggle asc/desc
- Active sort column gets a green caret indicator
- Default sort: Rating descending (highest confidence first)

### Search
- Searches across: `name`, `registry`, `country`, `type`, `id`, `notes`
- Debounced 200ms (feels instant, avoids re-render on every keystroke)
- Original only searched `notes` — fix this

### Filters (dropdowns)
- **Type:** All / REDD+ / ARR / Mangrove / Biochar / Soil C / DAC
- **Registry:** All / Verra / Gold Standard / ACR / CAR
- **Risk:** All / High / Medium / Low / Unrated

### Row design
- `ID` — monospace, muted grey
- `Name` — semibold, full weight
- `Type` — small chip (grey pill)
- `Rating` — colour-coded badge with dot (High/Medium/Low/Unrated)
- `Notes` — truncated at ~60 chars, expand on row click (inline `<details>` or toggle class)
- Hover state: light green tint `#e8f5f0`

### Flagged row highlighting
Projects with `tier === "low"` get a very subtle left-border in red (`border-left: 3px solid var(--color-red-200)`) so they stand out without screaming.

---

## 8. Header

- Background: `--color-green-900` (#0c3d2e)
- Keep the embedded base64 logo — filter it to white with `filter: brightness(0) invert(1)` so it reads on dark background
- Height: 64px (tighter than the original 92px)
- Right side: "Internal Tool" badge (faint outline) + Export CSV button

---

## 9. Functionality: Export CSV

Wire the Export button to actually produce a CSV of the filtered rows:
```js
function exportCSV(rows) {
  const cols = ['id','name','type','country','registry','vintage','volume','price','rating','updated'];
  const csv = [cols.join(','), ...rows.map(r => cols.map(k => `"${r[k] ?? ''}"`).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'carbonai-portfolio.csv';
  a.click();
}
```

---

## 10. Accessibility

- All table headers use `<th scope="col">`
- Sort direction communicated via `aria-sort="ascending|descending|none"`
- Risk badges have text labels, not just colour dots
- Search input has a `<label>` (visually hidden is fine)
- Colour contrast: all text passes WCAG AA at the chosen sizes

---

## 11. Implementation Order (priority-first)

1. **CSS design system** — paste in token variables, reset, typography, spacing. 15 min.
2. **Data normalisation** — write `parseVolume`, `parsePrice`, `normaliseRating`, `parseDate`. Test in console. 20 min.
3. **Table render + full sort + full search** — core analyst workflow. 25 min.
4. **KPI strip** — compute from normalised data, render cards. 10 min.
5. **Header + footer** — logo, colours, export button. 10 min.
6. **Charts** — Chart.js donut + horizontal bar. 20 min.
7. **Filter dropdowns** — wire up to table render. 10 min.
8. **Row expand for notes** — toggle on click. 5 min.
9. **Polish pass** — hover states, responsive table scroll, empty state. 10 min.

**Total: ~2h 5min** — leaves buffer for NOTES.md and testing.

---

## 12. What to Write in NOTES.md

```markdown
## Decisions

### Stack
Stayed single-file. Chart.js via CDN, Inter via Google Fonts.
No build step means zero friction for the reviewer.

### Layout hierarchy
KPIs → Charts → Table. Analyst needs the "how big/how risky is this portfolio"
answer before they care about individual rows.

### Chart choices
Donut for risk distribution (part-to-whole, 4 tiers, no time axis).
Horizontal bar for volume by type (long labels, comparison not trend).
Dropped a price/rating scatter — 14 points across 3 currencies would mislead.

### Data normalisation
All source values left untouched in the `projects` array.
Normalisation helpers (parseVolume, normaliseRating, etc.) derive display
and sort values. Inconsistencies are a real data quality issue and I've
called them out in the code comments.

### Search & sort
Extended search to cover all fields (original only matched notes).
All columns now sortable; default sort is rating descending so highest-
confidence projects lead.

### What I'd do next in production
- Backend API + pagination (14 rows is fine statically, 1400 is not)
- Saved filter state in URL params so analysts can share deep links
- Click-through to a project detail page
- Proper i18n for currency display
- Dark mode (one CSS variable swap)
- Unit tests for the normalisation helpers — they're the most fragile part
```

---

## 13. Things to Be Ready to Explain in the Interview

| Question they'll ask | Your answer |
|---|---|
| Why not React? | Single file, no deps, same result — overhead with no user benefit |
| Why a donut for risk? | Part-to-whole, 4 categories, no time axis. Bar implies ranking. |
| Why horizontal bar for volume? | Long type labels; no 45° rotation hack needed |
| How did you handle the data inconsistencies? | Normalise at render time, never mutate source. Treats it as a data quality problem to be visible, not hidden. |
| What would you do differently? | Production needs pagination, URL-state for filters, a project detail route, and tests on the normalisation logic |
| Why Inter? | Designed for UI, extremely legible at 12-13px data-table density, widely used in B2B SaaS — feels professional without being generic Arial |
| Why green not blue? | The existing blue (#314e89) reads as generic corporate. CarbonAI's product is environmental — deep forest green anchors the brand in the domain without being clichéd |
