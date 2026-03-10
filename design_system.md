# Design System

This document reflects the design tokens currently implemented in [css/main.css](/c:/Users/eau12/Desktop/PortfolioV0/css/main.css).

## Principles

- Use semantic tokens first.
- Prefer subject-driven naming for reusable UI roles.
- Use descriptive naming when a token is purely visual.
- Reuse tokens instead of introducing raw color, spacing, radius, or shadow values in component rules.

## Layout Tokens

| Token | Value | Description |
| --- | --- | --- |
| `--layout-width` | `1728px` | Max page layout width. |
| `--layout-margin-h` | `clamp(24px, 9.26vw, 160px)` | Responsive horizontal page margin. |
| `--layout-margin-v` | `40px` | Base vertical page margin. |
| `--layout-content-width` | `1408px` | Max content width used by major sections. |
| `--layout-content-fluid` | `min(var(--layout-content-width), calc(100vw - 2 * var(--layout-margin-h)))` | Responsive content width constrained by page margins. |
| `--layout-col-gutter` | `12px` | Grid gutter width. |
| `--layout-col-width` | `calc((var(--layout-content-width) - 11 * var(--layout-col-gutter)) / 12)` | Single column width in the 12-column grid. |
| `--hero-msg-width` | `calc(5 * var(--layout-col-width))` | Hero message width spanning 5 columns. |
| `--hero-color-width` | `calc(2 * var(--layout-col-width))` | Decorative hero color block width. |
| `--hero-color-height` | `calc(var(--hero-color-width) * 110 / 225)` | Decorative hero color block height. |
| `--hero-font-size` | `calc(var(--hero-color-height) * 0.44)` | Hero headline font size derived from block height. |
| `--hero-row-gap` | `clamp(8px, 1.8vw, 32px)` | Hero grid row gap. |
| `--hero-inner-gap` | `clamp(32px, 7.41vw, 128px)` | Hero internal vertical spacing. |
| `--card-gap` | `clamp(4px, calc(var(--layout-content-fluid) * (6 / 1408)), 6px)` | Responsive gap between project preview images: 6px at full content width, shrinking proportionally down to a 4px floor on small screens. |
| `--card-green-w` | `clamp(320px, calc(var(--layout-content-fluid) * (464 / 1408)), 464px)` | Shared width for the first preview image and the left-side title panel in chronological cards. Scales responsively, capped at 464px and floor-limited to 320px. |
| `--card-item-gap-base` | `12px` | Base gap between carousel cards before responsive scaling. |
| `--card-item-width-base` | `252px` | Base carousel card width before responsive scaling. |
| `--card-item-gap` | `calc(var(--card-item-gap-base) * var(--card-scale))` | Responsive carousel gap derived from the shared card scale. |
| `--card-item-width` | `calc(var(--card-item-width-base) * var(--card-scale))` | Responsive carousel card width derived from the shared card scale. |
| `--card-scale` | `1` | Scale multiplier used to fit five carousel cards inside the available content width. |
| `--visible-cards` | `5` | Default visible carousel card count. |
| `--scroll-duration` | `50` | Carousel animation duration in seconds. |

## Color Tokens

### Surface

| Token | Value | Description |
| --- | --- | --- |
| `--surface-page-default` | `#ffffff` | Primary page and card background. |
| `--surface-brand-hero-bright` | `#a5ffde` | Bright brand accent block in the hero. |
| `--surface-brand-subtle` | `#d1f7f1` | Main soft mint surface for section backgrounds. |
| `--surface-brand-muted` | `#e8fffb` | Muted mint surface for title panels and hover states. |
| `--surface-brand-badge` | `#d4f2ed` | Soft brand badge background. |
| `--surface-neutral-subtle` | `#f3f3f3` | Soft neutral surface for subtle badges. |
| `--surface-overlay-card` | `rgba(59, 62, 62, 0.9)` | Dark translucent label background. |
| `--surface-overlay-card-hover` | `rgba(47, 58, 56, 0.9)` | Hover state for dark translucent labels. |
| `--surface-overlay-panel` | `rgba(28, 34, 31, 0.87)` | Dark overlay panel behind hover descriptions. |
| `--surface-overlay-scrim` | `rgba(0, 0, 0, 0.5)` | Full-screen overlay scrim. |
| `--surface-glass-nav` | `rgba(255, 255, 255, 0.9)` | Sticky desktop navigation glass surface. |

### Text

| Token | Value | Description |
| --- | --- | --- |
| `--text-primary` | `#1a1a1a` | Primary text color. |
| `--text-secondary` | `#818181` | Secondary text color. |
| `--text-tertiary` | `#88a4a0` | Tertiary/supporting text color. |
| `--text-primary-muted` | `#2f3a38` | Softer dark text used in lower-emphasis contexts. |
| `--text-inverse` | `#f3f3f3` | Inverse text on dark or image surfaces. |
| `--text-inverse-muted` | `#d6d6d6` | Muted inverse text for supporting label content. |
| `--text-brand-default` | `#156347` | Default brand text color. |
| `--text-brand-medium` | `#56b291` | Mid-strength brand accent text. |
| `--text-brand-soft` | `#a8efe3` | Soft brand highlight text. |
| `--text-brand-soft-hover` | `#c6f2eb` | Hover state for soft brand text. |
| `--text-brand-bright` | `#00f8a5` | Bright brand-accent text used sparingly. |

### Border and Focus

| Token | Value | Description |
| --- | --- | --- |
| `--border-brand-subtle` | `#a8efe3` | Subtle brand border. |
| `--border-neutral-medium` | `#8c9190` | Mid neutral border. |
| `--border-neutral-strong` | `#8b9190` | Stronger neutral border for dark overlays. |
| `--border-brand-hover` | `#658580` | Hover border on dark brand surfaces. |
| `--border-neutral-subtle` | `#b0b8b6` | Subtle neutral underline/border. |
| `--focus-ring-default` | `#1a1a1a` | Default focus outline color. |

### Shadow and Overlay Support

| Token | Value | Description |
| --- | --- | --- |
| `--shadow-color-soft` | `rgba(0, 0, 0, 0.06)` | Soft shadow color. |
| `--shadow-color-subtle` | `rgba(0, 0, 0, 0.04)` | Secondary subtle shadow color. |
| `--overlay-gradient-soft` | `rgba(0, 0, 0, 0.56)` | Soft image overlay gradient stop. |
| `--overlay-gradient-strong` | `rgba(0, 0, 0, 0.7)` | Strong image overlay gradient stop. |
| `--overlay-transparent` | `rgba(0, 0, 0, 0)` | Transparent overlay stop. |

### Skeleton

| Token | Value | Description |
| --- | --- | --- |
| `--skeleton-surface-base` | `#97b2ac` | Base skeleton fill, grey-green and low distraction. |
| `--skeleton-surface-highlight` | `#aec1bc` | Skeleton shimmer highlight. |

## Spacing Tokens

| Token | Value | Description |
| --- | --- | --- |
| `--space-1` | `4px` | Extra-tight spacing. |
| `--space-2` | `8px` | Tight spacing. |
| `--space-3` | `12px` | Compact spacing. |
| `--space-4` | `16px` | Default component spacing. |
| `--space-5` | `24px` | Comfortable section/component spacing. |
| `--space-6` | `32px` | Large spacing. |
| `--space-7` | `40px` | Extra-large spacing. |
| `--space-8` | `48px` | Section spacing. |
| `--space-9` | `64px` | Large section spacing. |

## Radius Tokens

| Token | Value | Description |
| --- | --- | --- |
| `--radius-xs` | `2px` | Micro radius for tiny badges. |
| `--radius-sm` | `4px` | Small radius. |
| `--radius-md` | `8px` | Medium radius for cards and inner surfaces. |
| `--radius-lg` | `16px` | Large card radius. |
| `--radius-xl` | `24px` | Extra-large modal/frame radius. |
| `--radius-pill` | `100px` | Full pill radius. |
| `--radius-pill-soft` | `89.626px` | Figma-matched pill radius for project tags. |

## Shadow Tokens

| Token | Value | Description |
| --- | --- | --- |
| `--shadow-card-rest` | `0 4px 24px var(--shadow-color-soft), 0 2px 8px var(--shadow-color-subtle)` | Default project card elevation. |

## Usage Rules

- Prefer semantic tokens like `--surface-page-default` or `--text-primary` over raw hex values.
- Use scale tokens for reusable spacing and radius values before adding one-off component values.
- If a new token is purely component-specific and unlikely to be reused, create it only after checking whether an existing semantic token already fits.
- When introducing new colors, add them to the appropriate category here before using them in component styles.

## Current Gaps

- Some layout values are still component-specific and not yet normalized into a broader spacing scale.
- A few non-scale values such as `14px`, `18px`, `21px`, `26px`, and `28px` are still present in component rules and may later become component tokens if repeated.
