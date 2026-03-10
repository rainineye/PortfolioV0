# Rules — Things I Got Wrong Before

A checklist to verify before every code change.

---

## Autoscroll Cards (`.project-item` / `.project-card-thumb`)

- [ ] **5 cards always visible** — card width must use the dynamic formula:
  `calc((100vw - 2 * var(--layout-margin-h) - 4 * var(--card-item-gap)) / 5)`
  Never use a fixed `270px` — that only fits 5 at exactly 1728px and shows 4 at smaller viewports.

- [ ] **Proportional scaling** — ALL card content must scale with `--card-scale: calc(var(--card-item-width) / 270)`.
  This includes: badge size/font, label padding/font/gap, title font/padding, desc padding/font, item gap.
  Never hardcode `14px`, `21px`, `9.6px` etc. — always `calc(var(--card-scale) * Npx)`.

- [ ] **Card structure** — `.project-item` is a vertical flex column with `gap: calc(var(--card-scale) * 9px)`.
  Two children: number badge (outside/above the card image) + `.project-card-thumb` (the dark image card).
  The badge is NOT inside the card image.

- [ ] **Card thumb dimensions** — `width: 100%`, `height: calc(var(--card-item-width) * (276/270))`.
  `border-radius: calc(var(--card-scale) * 8px)`, `padding: calc(var(--card-scale) * 14.4px)`.
  `display: flex; flex-direction: column; justify-content: space-between` (label top, title bottom).

- [ ] **Normal state label bg** — `rgba(59, 62, 62, 0.9)`, border `#8b9190`, text `#d6d6d6` (Roboto Condensed 14px).

- [ ] **Hover state label** — bg `rgba(47, 58, 56, 0.9)`, border `#658580`, text `#c6f2eb`.

- [ ] **Hover state desc panel** — NOT `inset: 0` full overlay. Absolutely positioned between label and title:
  - top: `calc(var(--card-scale) * (14.4 + 24.4 + 24))`
  - bottom: `calc(var(--card-scale) * (14.4 + 34.6 + 24))`
  - left/right: `calc(var(--card-scale) * 14.4px)`
  - bg: `rgba(28, 34, 31, 0.87)`
  - border-radius: `8 8 8 0` (bottom-left corner is flat per Figma node 808:3724)
  - text: `#00f8a5`, Tomorrow, **left-aligned**

- [ ] **Hover title color** — `#a8efe3`.

- [ ] **Hover badge** — bg `#e8fffb`, number `#56b291`.

- [ ] **Do not touch autoscroll cards** when fixing chronological cards. These are two separate components.

---

## Chronological Cards (`.project-card`) — based on Figma node 310-1536

- [ ] **No CSS grid on `.project-card`** — Figma uses VERTICAL auto-layout with `itemSpacing: 0`. Use `display: flex; flex-direction: column`. **NO gap columns anywhere.**

- [ ] **Preview row layout** — `display: flex; flex-direction: row; gap: var(--card-gap); background: white; border-radius: 16px 16px 0 0; overflow: hidden`.
  Height is proportional: `calc((100vw - 2 * var(--layout-margin-h)) * (268 / 1408))`, capped at 268px at ≥1728px.

- [ ] **Preview thumb widths — ALL THREE EQUAL** — `flex: 1` on all three thumbs. Figma shows 3×464px equal images with 8px gap (3×464 + 2×8 = 1408px). Do NOT make thumb-left fixed to `--card-green-w` — the green panel width and image width only happen to match at 1408px.

- [ ] **`.project-card` has `border-radius: 16px`** (no `overflow: hidden`) — this shapes the hover shadow correctly. Per-corner radii on children handle the visual clipping.

- [ ] **Per-corner border-radii on children** — set directly on each child, NOT via parent overflow:
  - Preview: `border-radius: 16px 16px 0 0; overflow: hidden` (TL TR, clips images)
  - Green panel (`.project-card-title-block`): `border-radius: 0 0 0 16px` (BL only)
  - White desc (`.project-card-desc`): `border-radius: 0 0 16px 0` (BR only)

- [ ] **Info row layout** — `display: flex; flex-direction: row; align-items: stretch`.
  `project-card-title-block` is `flex: 0 0 var(--card-green-w)`.
  `project-card-desc` is `flex: 1`.

- [ ] **No gap between preview and info rows** — `.project-card` is `flex-direction: column` with no gap/padding between children.

- [ ] **White background** — `.project-card-info` has `background: white`. White also fills the gaps between images in preview.

- [ ] **Project name at bottom of green panel** — `.project-card-title-block` needs `display: flex; flex-direction: column`. `.project-card-title-inner` needs `flex: 1`. `.project-card-title-left` needs `justify-content: space-between; height: 100%`.

- [ ] **Image gap scaling** — `--card-gap: 8px` default, `6px` at ≤1024px, `4px` at ≤599px.

---

## Hero Section

- [ ] **8px spacing between hero text and color block** — `.hero-msg-right` must use `justify-content: flex-end; gap: 8px`, NOT `justify-content: space-between`.

- [ ] **Hero margin must align with chronological cards** — both use `padding: 0 var(--layout-margin-h)`. Do NOT add a `max-width` override on `.portfolio-site` at any breakpoint (e.g. no `max-width: 1440px` at 1536px) — it would shift the hero content's effective left edge relative to the cards, which bleed full-viewport and apply their own `padding: 0 var(--layout-margin-h)`.

---

## Navbar / Tabs

- [ ] **Comma (`.tab-sep`) alignment** — use `padding-bottom: 2px` (same as `.tab`). Do NOT use `padding-top: 4px` which lowers the comma.

- [ ] **Tabs get hover underline** — only `.tab::after`, never `.contact-link::after`.

- [ ] **Contact has NO hover underline** — do not add `::after` to `.contact-link`.

- [ ] **Hover underline is grey, active underline is green** — `.tab::after` uses grey (`#b0b8b6`). `.tab.active::after { display: none }` because the active tab uses `border-bottom-color: #a8efe3` directly on the element (not pseudo-element). Do NOT use `#a8efe3` for the hover underline.

---

## Icons (`.project-card-redirect-item`)

- [ ] **Use `assets/icons/` not `assets/library/`** — the `assets/icons/` directory contains the design-system icons built from the Figma icon library (node 328-1825). `assets/library/` is the old/deprecated set.

- [ ] **Icon SVGs include the text label** — each icon SVG (e.g. `full-story--available.svg`) embeds both the glyph AND the text ("Full Story"). Do NOT add a separate `<span class="redirect-text">` alongside these icons — it would duplicate the label.

- [ ] **Icon mapping**:
  - Full Story (available) → `assets/icons/full-story--available.svg`
  - Full Story (locked/NDA) → `assets/icons/full-story--lock.svg`
  - Product → `assets/icons/product--available.svg`
  - Whitepaper → `assets/icons/whitepaper--available.svg`

- [ ] **Icon height** — set `height="22"` on `<img>`. Width auto-follows the SVG's aspect ratio.

---

## Figma API

- **Token**: do NOT commit to git (GitHub push protection will block it). Ask user to provide each session or store in a local `.env` file.
- **File ID**: `DQ4Nlj3OMwkvtmTegz7Mox`
- **Endpoint**: `https://api.figma.com/v1/files/{fileId}/nodes?ids={node-id}&depth=6`
- **Header**: `X-Figma-Token: <token>`
- When fetches fail, refresh the token and update this file.

---

## General

- [ ] **Never revert working changes** — when fixing one component, read that section of CSS first and edit only what is needed. Do not touch unrelated selectors.

- [ ] **Match exact Figma colors** — always use the exact hex from Figma API. Key values:
  - Section bg: `#d1f7f1`
  - Project title bg (green panel): `#e8fffb`
  - Project number bg (chronological badge): `#d4f2ed`
  - Project number color (chronological): `#56b291`
  - Label text (chronological): `#156347`
  - Label border (chronological): `#a8efe3`
  - Autoscroll card number bg (normal): `#f3f3f3`
  - Autoscroll card number text (normal): `#2f3a38`
  - Autoscroll card title (normal): `#f3f3f3`

- [ ] **Workflow** — make all fixes → push to GitHub. User has authorized autonomous pushing; no longer need to wait for "可以了" approval unless explicitly stated.
