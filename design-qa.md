# Concept 3 Hero Blossom — Design QA

**Source visual truth**

- Path: `/mnt/c/Users/Helios Neo 16/Downloads/k3_portfolio_blossom_concept_3.png`
- Source pixels: 768 × 512 at 1× density.
- Intended use: branch silhouette, four-blossom hierarchy, bud placement, negative space, stepped pixel density, asymmetry, and right-heavy visual weight. The reference label and dark background are explicitly excluded by the implementation brief.

**Rendered implementation evidence**

- Full desktop screenshot: `/tmp/k3-concept3-1440.png`
- Focused hero-art screenshot: `/tmp/k3-concept3-art.png`
- Combined source/implementation comparison: `/tmp/k3-concept3-comparison.png`
- Mobile screenshot: `/tmp/k3-concept3-375.png`
- Tablet screenshot: `/tmp/k3-concept3-768.png`
- Desktop viewport: 1440 × 1100 CSS px at device scale factor 1; screenshot pixels: 1440 × 1100.
- Focused implementation region: 592 × 555 CSS px at device scale factor 1; screenshot pixels: 592 × 555.
- Mobile viewport: 375 × 1000 CSS px at device scale factor 1; screenshot pixels: 375 × 1000.
- Tablet viewport: 768 × 1000 CSS px at device scale factor 1; screenshot pixels: 768 × 1000.
- State: English homepage, stable blossom, `prefers-reduced-motion: reduce` for the static comparison.
- Density normalization: the source was proportionally resized and centered on a 592 × 555 comparison canvas; the implementation was captured at 1:1 CSS-to-device pixels. Background and label differences were ignored because the brief explicitly excludes them.

**Findings**

- No actionable P0, P1, or P2 mismatches remain.
- Fonts and typography: hero type, weights, line height, wrapping, and copy are unchanged from the existing portfolio as required. Text remains readable and separate from the artwork at all tested widths.
- Spacing and layout rhythm: the branch keeps the reference's low left-to-right sweep, open negative space, and heavier lower-right trunk. It scales proportionally without rearranging flowers or overlapping essential hero content.
- Colors and visual tokens: the five lavender/violet flower tones and dark plum branch stay within the existing K3 palette. The reference's dark presentation background was intentionally not copied.
- Image quality and asset fidelity: the implementation uses crisp, individually addressable pixel rectangles as explicitly required by the brief. Four unequal primary blossoms and six attached buds are visible; no raster reference image, smooth petal vector, cube cluster, or particle substitute is used.
- Copy and content: hero copy, CTA copy, navigation, and all other page content remain unchanged.
- Accessibility and behavior: reduced motion shows the stable coordinate map. At 375, 768, 1024, and 1440 px, document and body widths exactly equal the viewport. The mobile menu opens with Space, closes with Escape, and returns focus to its trigger. No browser console errors were recorded.
- Animation restoration: all 355 addressable cells returned to their exact initial bounds, computed transform, and opacity after the strongest blossom burst; zero cell differences remained.

**Full-view comparison evidence**

- The combined comparison shows the same defining composition: sparse connected branch, four distinct lavender blossoms, small buds, large empty areas, and a dark stepped trunk weighted toward the lower right.
- Existing supporting garden geometry—the pale circle, mountains, wind lines, and thin K3 signature—remains intentionally visible because the task only replaces the blossom artwork.

**Focused-region comparison evidence**

- A focused region was required because blossom anatomy and stepped branch cells are too small to judge reliably in the full homepage capture.
- The focused capture confirms recognizable petal lobes with dark centers, varied flower sizes, connected twigs, sparse buds, crisp edges, and no anti-aliased or cube-like substitution.

**Comparison history**

1. Static full-view and focused comparison: no P0/P1/P2 mismatch found. The Concept 3 silhouette, hierarchy, and negative space were preserved.
2. Responsive normalization: an initial command-line mobile capture used Chrome's minimum window width and produced an invalid crop. It was discarded rather than treated as a design finding. An exact 375 px DevTools viewport then confirmed a 375 px document/body width, correct menu breakpoint, and proportional artwork.
3. Animation restoration: the first repeated harness run collided with an existing page timer and was discarded as invalid evidence. Fresh-load isolation produced exact restoration with 0 of 355 cells differing and no console errors.

**Implementation Checklist**

- [x] Replace the old blossom coordinate map instead of patching it.
- [x] Preserve four dominant flowers, sparse buds, asymmetry, and negative space.
- [x] Keep the branch connected and heavier toward the lower right.
- [x] Provide five controlled, localized blossom glitch variants.
- [x] Keep K3, CTA, and hero-word glitch identities distinct.
- [x] Preserve the 16-second, four-slot master sequence.
- [x] Restore every animated cell exactly after each burst.
- [x] Preserve reduced motion and responsive usability.
- [x] Verify production export, rendered HTML, keyboard behavior, overflow, and console output.

**Follow-up Polish**

- None required for acceptance.

final result: passed
