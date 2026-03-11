# Design System

This document reflects the design tokens currently implemented in [css/main.css](/c:/Users/eau12/Desktop/PortfolioV0/css/main.css).

## Principles

- Use semantic tokens first.
- Prefer subject-driven naming for reusable UI roles.
- Use descriptive naming when a token is purely visual.
- Reuse tokens instead of introducing raw color, spacing, radius, or shadow values in component rules.

## Layout Tokens


| Token                    | Value                                                                        | Description                                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--layout-width`         | `1728px`                                                                     | Max page layout width.                                                                                                                                          |
| `--layout-margin-h`      | `clamp(24px, 9.26vw, 160px)`                                                 | Responsive horizontal page margin.                                                                                                                              |
| `--layout-margin-v`      | `40px`                                                                       | Base vertical page margin.                                                                                                                                      |
| `--layout-content-width` | `1408px`                                                                     | Max content width used by major sections.                                                                                                                       |
| `--layout-content-fluid` | `min(var(--layout-content-width), calc(100vw - 2 * var(--layout-margin-h)))` | Responsive content width constrained by page margins.                                                                                                           |
| `--layout-col-gutter`    | `12px`                                                                       | Grid gutter width.                                                                                                                                              |
| `--layout-col-width`     | `calc((var(--layout-content-width) - 11 * var(--layout-col-gutter)) / 12)`   | Single column width in the 12-column grid.                                                                                                                      |
| `--hero-msg-width`       | `calc(5 * var(--layout-col-width))`                                          | Hero message width spanning 5 columns.                                                                                                                          |
| `--hero-color-width`     | `calc(2 * var(--layout-col-width))`                                          | Decorative hero color block width.                                                                                                                              |
| `--hero-color-height`    | `calc(var(--hero-color-width) * 110 / 225)`                                  | Decorative hero color block height.                                                                                                                             |
| `--hero-font-size`       | `calc(var(--hero-color-height) * 0.44)`                                      | Hero headline font size derived from block height.                                                                                                              |
| `--hero-row-gap`         | `clamp(8px, 1.8vw, 32px)`                                                    | Hero grid row gap.                                                                                                                                              |
| `--hero-inner-gap`       | `clamp(32px, 7.41vw, 128px)`                                                 | Hero internal vertical spacing.                                                                                                                                 |
| `--card-gap`             | `clamp(4px, calc(var(--layout-content-fluid) * (6 / 1408)), 6px)`            | Responsive gap between project preview images: 6px at full content width, shrinking proportionally down to a 4px floor on small screens.                        |
| `--card-green-w`         | `clamp(320px, calc(var(--layout-content-fluid) * (464 / 1408)), 464px)`      | Shared width for the first preview image and the left-side title panel in chronological cards. Scales responsively, capped at 464px and floor-limited to 320px. |
| `--card-item-gap-base`   | `12px`                                                                       | Base gap between carousel cards before responsive scaling.                                                                                                      |
| `--card-item-width-base` | `252px`                                                                      | Base carousel card width before responsive scaling.                                                                                                             |
| `--card-item-gap`        | `calc(var(--card-item-gap-base) * var(--card-scale))`                        | Responsive carousel gap derived from the shared card scale.                                                                                                     |
| `--card-item-width`      | `calc(var(--card-item-width-base) * var(--card-scale))`                      | Responsive carousel card width derived from the shared card scale.                                                                                              |
| `--card-scale`           | `1`                                                                          | Scale multiplier used to fit five carousel cards inside the available content width.                                                                            |
| `--visible-cards`        | `5`                                                                          | Default visible carousel card count.                                                                                                                            |
| `--scroll-duration`      | `50`                                                                         | Carousel animation duration in seconds.                                                                                                                         |


## Color Tokens

### Surface

| Token | Value | Preview | Description |
| ----- | ----- | ------- | ----------- |
| `--surface-page-default` | `#ffffff` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#ffffff;border:1px solid #ddd;vertical-align:middle"></span> | Primary page and card background. |
| `--surface-brand-hero-bright` | `#a5ffde` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#a5ffde;vertical-align:middle"></span> | Bright brand accent block in the hero. |
| `--surface-brand-subtle` | `#d1f7f1` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#d1f7f1;vertical-align:middle"></span> | Main soft mint surface for section backgrounds. |
| `--surface-brand-muted` | `#e8fffb` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#e8fffb;border:1px solid #ddd;vertical-align:middle"></span> | Muted mint surface for title panels and hover states. |
| `--surface-brand-badge` | `#d4f2ed` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#d4f2ed;vertical-align:middle"></span> | Soft brand badge background. |
| `--surface-neutral-subtle` | `#f3f3f3` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#f3f3f3;border:1px solid #ddd;vertical-align:middle"></span> | Soft neutral surface for subtle badges. |
| `--surface-overlay-card` | `rgba(59, 62, 62, 0.9)` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:rgba(59,62,62,0.9);vertical-align:middle"></span> | Dark translucent label background. |
| `--surface-overlay-card-hover` | `rgba(47, 58, 56, 0.9)` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:rgba(47,58,56,0.9);vertical-align:middle"></span> | Hover state for dark translucent labels. |
| `--surface-overlay-panel` | `rgba(28, 34, 31, 0.87)` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:rgba(28,34,31,0.87);vertical-align:middle"></span> | Dark overlay panel behind hover descriptions. |
| `--surface-overlay-scrim` | `rgba(0, 0, 0, 0.5)` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:rgba(0,0,0,0.5);vertical-align:middle"></span> | Full-screen overlay scrim. |
| `--surface-glass-nav` | `rgba(255, 255, 255, 0.9)` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:rgba(255,255,255,0.9);border:1px solid #ddd;vertical-align:middle"></span> | Sticky desktop navigation glass surface. |

### Text

| Token | Value | Preview | Description |
| ----- | ----- | ------- | ----------- |
| `--text-primary` | `#1a1a1a` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#1a1a1a;vertical-align:middle"></span> | Primary text color. |
| `--text-secondary` | `#818181` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#818181;vertical-align:middle"></span> | Secondary text color. |
| `--text-tertiary` | `#88a4a0` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#88a4a0;vertical-align:middle"></span> | Tertiary/supporting text color. |
| `--text-primary-muted` | `#2f3a38` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#2f3a38;vertical-align:middle"></span> | Softer dark text used in lower-emphasis contexts. |
| `--text-inverse` | `#f3f3f3` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#f3f3f3;border:1px solid #ddd;vertical-align:middle"></span> | Inverse text on dark or image surfaces. |
| `--text-inverse-muted` | `#d6d6d6` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#d6d6d6;vertical-align:middle"></span> | Muted inverse text for supporting label content. |
| `--text-brand-default` | `#156347` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#156347;vertical-align:middle"></span> | Default brand text color. |
| `--text-brand-medium` | `#56b291` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#56b291;vertical-align:middle"></span> | Mid-strength brand accent text. |
| `--text-brand-soft` | `#a8efe3` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#a8efe3;vertical-align:middle"></span> | Soft brand highlight text. |
| `--text-brand-soft-hover` | `#c6f2eb` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#c6f2eb;vertical-align:middle"></span> | Hover state for soft brand text. |
| `--text-brand-bright` | `#00f8a5` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#00f8a5;vertical-align:middle"></span> | Bright brand-accent text used sparingly. |

### Border and Focus

| Token | Value | Preview | Description |
| ----- | ----- | ------- | ----------- |
| `--border-brand-subtle` | `#a8efe3` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#a8efe3;vertical-align:middle"></span> | Subtle brand border. |
| `--border-neutral-medium` | `#8c9190` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#8c9190;vertical-align:middle"></span> | Mid neutral border. |
| `--border-neutral-strong` | `#8b9190` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#8b9190;vertical-align:middle"></span> | Stronger neutral border for dark overlays. |
| `--border-brand-hover` | `#658580` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#658580;vertical-align:middle"></span> | Hover border on dark brand surfaces. |
| `--border-neutral-subtle` | `#b0b8b6` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#b0b8b6;vertical-align:middle"></span> | Subtle neutral underline/border. |
| `--focus-ring-default` | `#1a1a1a` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#1a1a1a;vertical-align:middle"></span> | Default focus outline color. |

### Shadow and Overlay Support

| Token | Value | Preview | Description |
| ----- | ----- | ------- | ----------- |
| `--shadow-color-soft` | `rgba(0, 0, 0, 0.06)` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:rgba(0,0,0,0.06);border:1px solid #ddd;vertical-align:middle"></span> | Soft shadow color. |
| `--shadow-color-subtle` | `rgba(0, 0, 0, 0.04)` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:rgba(0,0,0,0.04);border:1px solid #ddd;vertical-align:middle"></span> | Secondary subtle shadow color. |
| `--overlay-gradient-soft` | `rgba(0, 0, 0, 0.56)` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:rgba(0,0,0,0.56);vertical-align:middle"></span> | Soft image overlay gradient stop. |
| `--overlay-gradient-strong` | `rgba(0, 0, 0, 0.7)` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:rgba(0,0,0,0.7);vertical-align:middle"></span> | Strong image overlay gradient stop. |
| `--overlay-transparent` | `rgba(0, 0, 0, 0)` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:rgba(0,0,0,0);border:1px solid #ddd;vertical-align:middle"></span> | Transparent overlay stop. |

### Skeleton

| Token | Value | Preview | Description |
| ----- | ----- | ------- | ----------- |
| `--skeleton-surface-base` | `#97b2ac` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#97b2ac;vertical-align:middle"></span> | Base skeleton fill, grey-green and low distraction. |
| `--skeleton-surface-highlight` | `#aec1bc` | <span style="display:inline-block;width:16px;height:16px;border-radius:3px;background:#aec1bc;vertical-align:middle"></span> | Skeleton shimmer highlight. |


## Spacing Tokens


| Token       | Value  | Description                            |
| ----------- | ------ | -------------------------------------- |
| `--space-1` | `4px`  | Extra-tight spacing.                   |
| `--space-2` | `8px`  | Tight spacing.                         |
| `--space-3` | `12px` | Compact spacing.                       |
| `--space-4` | `16px` | Default component spacing.             |
| `--space-5` | `24px` | Comfortable section/component spacing. |
| `--space-6` | `32px` | Large spacing.                         |
| `--space-7` | `40px` | Extra-large spacing.                   |
| `--space-8` | `48px` | Section spacing.                       |
| `--space-9` | `64px` | Large section spacing.                 |


## Radius Tokens


| Token                | Value      | Description                                 |
| -------------------- | ---------- | ------------------------------------------- |
| `--radius-xs`        | `2px`      | Micro radius for tiny badges.               |
| `--radius-sm`        | `4px`      | Small radius.                               |
| `--radius-md`        | `8px`      | Medium radius for cards and inner surfaces. |
| `--radius-lg`        | `16px`     | Large card radius.                          |
| `--radius-xl`        | `24px`     | Extra-large modal/frame radius.             |
| `--radius-pill`      | `100px`    | Full pill radius.                           |
| `--radius-pill-soft` | `89.626px` | Figma-matched pill radius for project tags. |


## Shadow Tokens


| Token                | Value                                                                       | Description                     |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------- |
| `--shadow-card-rest` | `0 4px 24px var(--shadow-color-soft), 0 2px 8px var(--shadow-color-subtle)` | Default project card elevation. |


## Usage Rules

- Prefer semantic tokens like `--surface-page-default` or `--text-primary` over raw hex values.
- Use scale tokens for reusable spacing and radius values before adding one-off component values.
- If a new token is purely component-specific and unlikely to be reused, create it only after checking whether an existing semantic token already fits.
- When introducing new colors, add them to the appropriate category here before using them in component styles.

## Mobile Layout (≤768px) – Figma 1083-2251

| Token                    | Value                                    | Description                        |
| ------------------------ | ---------------------------------------- | ---------------------------------- |
| `--layout-margin-h`      | `20px`                                   | Horizontal page margin.            |
| `--layout-col-gutter`    | `8px`                                    | Grid gutter.                       |
| `--layout-content-fluid` | `calc(100vw - 40px)`                     | Content width (full width − margins). |
| `--layout-col-width-fluid` | `calc((content − 5×gutter) / 6)`       | Column width in 6-column grid.     |

## Mobile Project Card – Figma 1089-2438

- Full-width card, white background, `--radius-lg`, 8px gap between cards.
- Preview: aspect-ratio 335/194, badge top-right (24×24).
- Info: labels, date, role, project name (18px semibold).

## Current Gaps

- Some layout values are still component-specific and not yet normalized into a broader spacing scale.
- A few non-scale values such as `14px`, `18px`, `21px`, `26px`, and `28px` are still present in component rules and may later become component tokens if repeated.
