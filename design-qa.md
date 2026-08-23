# Surgical Concept 3 Blossom Correction — Design QA

**Source visual truth**

- Path: `/mnt/c/Users/Helios Neo 16/Downloads/k3_portfolio_blossom_concept_3.png`
- Source pixels: 768 × 512 at 1× density.
- Intended use: the low, sweeping branch silhouette; recognizable blossom mass; four-level flower hierarchy; restrained buds; open negative space; and heavier lower-right trunk. The reference label and dark presentation background are excluded by the correction brief.

**Rendered implementation evidence**

- Static desktop screenshot: `/tmp/k3-surgical-static-1440.png`
- Focused hero-art screenshot: `/tmp/k3-surgical-static-art.png`
- Final combined source/implementation comparison: `/tmp/k3-surgical-comparison-final.png`
- Focused source crop: `/tmp/k3-surgical-reference-focus.png`
- Focused implementation crop: `/tmp/k3-surgical-implementation-focus-final.png`
- Responsive captures: `/tmp/k3-surgical-final-375.png`, `/tmp/k3-surgical-final-768.png`, `/tmp/k3-surgical-final-1024.png`, and `/tmp/k3-surgical-final-1440.png`
- Responsive comparison sheet: `/tmp/k3-surgical-responsive-montage.png`
- Desktop viewport: 1440 × 1000 CSS px at device scale factor 1; screenshot pixels: 1440 × 1000.
- Focused hero-art region: 592 × 600 CSS px at device scale factor 1; screenshot pixels: 592 × 600.
- Responsive hero captures: 345 × 1106, 738 × 1173, 976 × 897, and 1180 × 903 px at device scale factor 1.
- State: English homepage. The source comparison locked the blossom in its stable debug state; the final browser pass restored normal glitch operation and separately verified reduced motion.
- Density normalization: the source and implementation blossom regions were cropped to their visible artwork bounds and proportionally resized to a common 570 × 320 comparison slot. Background, circle, mountains, wind lines, and K3 signature were not used to judge the source blossom silhouette.

**Findings**

- No actionable P0, P1, or P2 mismatches remain.
- Fonts and typography: hero copy, family, weight, scale, line height, tracking, wrapping, and antialiasing are unchanged, as required by the surgical scope.
- Spacing and layout rhythm: hero spacing and illustration slot are unchanged. The corrected artwork measures 1.61:1, sits slightly below the illustration center, retains open negative space, and fits without copy, CTA, K3, or viewport collisions.
- Colors and visual tokens: the pale lavender, lavender, violet, deep purple, and plum values remain the existing K3 tokens. The reference's dark presentation background was intentionally not copied.
- Image quality and asset fidelity: the deliberate addressable-pixel coordinate map now has 162 flower/bud cells and 152 branch cells. Four primary groups (36 / 24 / 36 / 36 cells) form recognizable lobed blossoms; six five-cell buds stay secondary. Crisp edges, dark centers, connected twigs, and a heavier stepped lower-right trunk match the reference character without using the reference PNG at runtime.
- Copy and content: navigation, labels, headline, body, CTA copy, and all non-blossom page content remain unchanged.
- Accessibility and behavior: the decorative hero role/label remains intact. At 375, 768, 1024, and 1440 px, document and body widths equal the viewport, no nested scroll containers are present, and the 44 × 44 mobile menu opens, closes with Escape, and returns focus. The bilingual switch round-trip passes.
- Motion: reduced motion keeps the stable flower. With normal motion, 31 flower cells visibly changed during the sampled blossom burst, zero branch cells moved, and all 314 cells returned with a maximum 0 px bounds delta. No browser console errors were recorded.

**Full-view comparison evidence**

- The final desktop capture preserves the supplied current hero's composition and supporting geometry while replacing only the malformed blossom coordinate map.
- The artwork reads wider than tall, with the focal flower near center, a medium left flower, a medium right flower, a smaller upper-left blossom, restrained buds, and strong lower-right trunk weight.
- The former high right-side antenna is gone: the final map contains zero branch cells with `x > 520` and `y < 220`.

**Focused-region comparison evidence**

- A focused comparison was required because individual petals and branch steps are too small to judge reliably in the full-page view.
- `/tmp/k3-surgical-comparison-final.png` places the source crop and implementation crop in one comparison input. It confirms the same low, airy, asymmetrical flowering-branch character, denser five-lobed main blossoms, short supporting twigs, and preserved negative space.
- The implementation intentionally retains the existing light K3 palette and clean crisp rectangles rather than copying the source's glow, dark background, or label.

**Comparison history**

1. `/tmp/k3-surgical-comparison-1.png` — P1: the first deliberate map achieved the correct 1.58:1 sweep and removed the old antenna group, but the primary flowers still had insufficient visible mass and the right supporting twig remained too upright. Fix: compacted petal coordinates, enlarged the three main blossoms, and shortened the right twig to a small diagonal support.
2. `/tmp/k3-surgical-comparison-2.png` — P2: the focal flower became dominant, but compacting the pixels made the blossoms read too much like crosses rather than Concept 3 petals. Fix: rebuilt the focal and major patterns as five distinct lobes around dark centers and enlarged the smaller upper-left primary blossom.
3. `/tmp/k3-surgical-comparison-3.png` — P2: the lobe structure was correct, but the outer petal masses were still lighter than the source at normal page scale. Fix: added one pale outer cell to each lobe on the three larger flowers while keeping the bud and branch density unchanged.
4. `/tmp/k3-surgical-comparison-final.png` — pass: no actionable P0/P1/P2 difference remains within the explicit constraints to preserve the existing light palette, hero layout, background geometry, and K3 mark.

**Implementation Checklist**

- [x] Preserve the previous implementation in git at commit `8d9f50e` before editing.
- [x] Lock animation while correcting the static blossom.
- [x] Replace the malformed coordinates with a deliberate fixed map.
- [x] Keep four recognizable primary blossoms and six secondary buds.
- [x] Remove the high antenna-like right branch.
- [x] Keep every major flower visually connected.
- [x] Weight the main trunk toward the lower right.
- [x] Preserve the K3 signature, circle, wind lines, mountains, hero type, copy, buttons, spacing, and routes.
- [x] Restore the existing five-variant glitch architecture without cumulative drift.
- [x] Verify 375, 768, 1024, and 1440 px layouts, reduced motion, menu keyboard behavior, language switching, overflow, and console output.
- [x] Pass production export, rendered-HTML tests, and lint.

**Follow-up Polish**

- None required for acceptance.

final result: passed
