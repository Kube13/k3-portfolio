# Exact Concept 3 Blossom Asset — Design QA

**Source visual truth**

- Canonical asset: `/mnt/c/Users/Helios Neo 16/Downloads/k3_concept3_blossom_transparent.png`
- Light-background reference: `/mnt/c/Users/Helios Neo 16/Downloads/k3_concept3_blossom_light_preview.png`
- Source pixels: 534 × 283 RGBA at 1× density; SHA-256 `804f3f01bd537a5b3069544a059637c5c35d0c69c8d32529ec7f0a1c7673c43c`.
- Scope: preserve the exact four major flowers, buds, branch angles, heavy lower-right trunk, wide silhouette, negative space, and proportions. Hero copy, layout, controls, circle, wind lines, mountains, and K3 mark remain unchanged.

**Rendered implementation evidence**

- Final source/implementation comparison: `/tmp/k3-exact-comparison-final.png`
- Focused source panel: `/tmp/k3-exact-source-focus.png`
- Focused implementation panel: `/tmp/k3-exact-implementation-focus.png`
- Stable responsive captures: `/tmp/k3-exact-final-375.png`, `/tmp/k3-exact-final-768.png`, `/tmp/k3-exact-final-1024.png`, and `/tmp/k3-exact-final-1440.png`
- Responsive comparison sheet: `/tmp/k3-exact-responsive-montage.png`
- Active-glitch capture: `/tmp/k3-exact-glitch-primary.png`
- Desktop viewport: 1440 × 1000 CSS px at device scale factor 1. Hero capture: 1180 × 903 px. Focused comparison panels: 520 × 300 px.
- Additional viewports: 375 × 900, 768 × 1024, and 1024 × 900 CSS px at device scale factor 1.
- State: English homepage. Stable comparison captures used reduced motion; a separate normal-motion pass sampled the blossom burst and verified restoration.
- Density normalization: the supplied 534 × 283 asset was proportionally downsampled with nearest-neighbor rendering to the browser's approximately 484 × 257 desktop display box. Source and implementation were centered in equal 520 × 300 comparison panels.

**Findings**

- No actionable P0, P1, or P2 mismatches remain.
- Fonts and typography: family, weight, scale, wrapping, line height, tracking, and hero hierarchy are unchanged.
- Spacing and layout rhythm: the asset occupies 81.75% of the 640-unit illustration viewBox, remains centered in the pale circle, sits above the K3 mark, and avoids the headline and viewport edges. The same proportional image scales cleanly at desktop, tablet, and mobile widths.
- Colors and visual tokens: the PNG's approved lavender, violet, plum, and dark branch pixels are unchanged. Existing background-circle, wind, mountain, and K3 tokens are preserved.
- Image quality and asset fidelity: the exported runtime asset is byte-identical to the supplied transparent PNG. All seven SVG image layers use that exact source, natural 534 × 283 dimensions, `preserveAspectRatio="xMidYMid meet"`, and pixelated rendering. The stable base layer never animates.
- Copy and content: navigation, hero copy, CTA labels, all page sections, routes, metadata, and content are unchanged.
- Accessibility and behavior: the decorative hero retains a descriptive image role. At 375, 768, 1024, and 1440 px, document and body widths equal the viewport and no nested horizontal or vertical scroll containers were found. The 44 × 44 mobile menu opens, closes with Escape, returns focus, and the bilingual selector round-trip passes.
- Motion: reduced motion exposes only the base PNG and disables all six glitch duplicates. Normal motion shows two clipped tears, a lavender ghost, and three data streaks during the 450 ms burst. The base moved 0 px during the burst, every duplicate used the same PNG, all duplicate opacity returned to zero, and final base restoration delta was 0 px.
- Console: no browser console errors or warnings were recorded.

**Full-view comparison evidence**

- The responsive sheet shows the same wide Concept 3 silhouette at all four breakpoints without redrawing or switching assets.
- The desktop hero preserves the original text/illustration split, circle, landscape geometry, and thin K3 signature. The four flowers and heavy lower-right trunk remain clearly recognizable.
- Mobile retains the complete PNG and proportional aspect ratio while existing responsive rules continue to hide only the supporting wind and mountains.

**Focused-region comparison evidence**

- A focused comparison was required because the pixel blossom details are too small to verify in a full hero capture.
- `/tmp/k3-exact-comparison-final.png` places the supplied asset and browser-rendered implementation in one comparison input. Flower positions, buds, branch steps, negative space, trunk mass, aspect ratio, and silhouette match exactly; only the intended page circle, wind line, and mountain watermark appear behind the implementation.

**Comparison history**

1. `/tmp/k3-exact-comparison-final.png` — first visual comparison passed with no actionable P0/P1/P2 differences, so no visual correction iteration was required.

**Implementation Checklist**

- [x] Copy the supplied transparent PNG without modification.
- [x] Remove the generated coordinate-map blossom.
- [x] Render one untouched base asset and six temporary duplicates of the same asset.
- [x] Preserve source dimensions and proportional scaling.
- [x] Keep the existing 16-second sequence and 4-second blossom slot.
- [x] Limit actual blossom corruption to 450 ms plus the existing 70 ms aftershock.
- [x] Reduce displacement on mobile.
- [x] Disable every duplicate layer for reduced motion.
- [x] Preserve hero typography, copy, buttons, K3, circle, wind, mountains, routes, and dependencies.
- [x] Pass production export, rendered-HTML tests, lint, responsive browser checks, keyboard checks, overflow checks, animation-restoration checks, and console checks.

**Follow-up Polish**

- None required for acceptance.

final result: passed
