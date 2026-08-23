import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const outDir = new URL("../out/", import.meta.url);
const requiredRoutes = [
  "index.html",
  "services/index.html",
  "websites/index.html",
  "case-studies/wisp/index.html",
  "case-studies/personal-intelligence-lab/index.html",
  "demos/cafe/index.html",
  "demos/restaurant/index.html",
  "demos/law-firm/index.html",
  "demos/shop/index.html",
];

const readRoute = route => readFileSync(join(outDir.pathname, route), "utf8");

test("exports every public portfolio route", () => {
  for (const route of requiredRoutes) {
    assert.equal(existsSync(join(outDir.pathname, route)), true, route);
  }
});

test("exports SEO metadata and static discovery files", () => {
  const homepage = readFileSync(join(outDir.pathname, "index.html"), "utf8");

  assert.match(homepage, /Data Analyst &amp; Automation Engineer · Product Builder/);
  assert.match(homepage, /<meta property="og:title"/);
  assert.match(homepage, /<link rel="canonical"/);
  assert.match(homepage, /https:\/\/k3labs\.me/);
  assert.match(homepage, /application\/ld\+json/);

  assert.equal(existsSync(join(outDir.pathname, "robots.txt")), true);
  assert.equal(existsSync(join(outDir.pathname, "sitemap.xml")), true);
  assert.equal(existsSync(join(outDir.pathname, "k3-cv.html")), true);
  assert.equal(existsSync(join(outDir.pathname, "datacamp-python-data-associate.pdf")), true);
});

test("exports descriptive case-study metadata and dated Wisp evidence", () => {
  const wisp = readRoute("case-studies/wisp/index.html");
  const lab = readRoute("case-studies/personal-intelligence-lab/index.html");

  assert.match(wisp, /Wisp Case Study \| Product Analytics, AI &amp; Automation \| K3/);
  assert.match(wisp, /FUNNEL SNAPSHOT · AUGUST 2026/);
  assert.match(lab, /Personal Intelligence Lab \| Data Analytics Case Study \| K3/);
  assert.match(lab, /SYSTEM IN DEVELOPMENT/);
});

test("exports the shared accessible navigation on portfolio entry routes", () => {
  for (const route of ["index.html", "services/index.html", "websites/index.html"]) {
    const html = readRoute(route);
    const menuId = html.match(/aria-controls="([^"]+)"/)?.[1];

    assert.match(html, /class="site-nav-toggle"/);
    assert.match(html, /<header class="site-header">/);
    assert.match(html, /class="nav site-nav site-header__inner shell"/);
    assert.match(html, /aria-expanded="false"/);
    assert.ok(menuId, `${route}: menu toggle controls an in-flow panel`);
    assert.match(html, new RegExp(`id="${menuId}"[^>]*hidden`));
    assert.match(html, /aria-pressed="true"/);
    assert.match(html, /aria-pressed="false"/);
    assert.match(html, />မြန်မာ</);
  }
});

test("preserves the focused homepage hierarchy and verified Wisp metrics", () => {
  const homepage = readRoute("index.html");
  const homepageText = homepage.replace(/<[^>]+>/g, " ");
  const footer = homepage.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? "";

  assert.match(homepage, /id="work"/);
  assert.match(homepage, /id="capabilities"/);
  assert.match(homepage, /id="websites"/);
  assert.match(homepage, /id="about"/);
  assert.match(homepage, /id="contact"/);
  assert.match(homepage, /<strong>101<\/strong>/);
  assert.match(homepage, /<strong>70<\/strong>/);
  assert.match(homepage, /<strong>69\.3%<\/strong>/);
  assert.match(homepage, /Data Analyst &amp; Automation Engineer · Product Builder/);
  assert.match(homepage, /I turn complex/);
  assert.match(homepageText, /systems\s+that/);
  assert.match(homepageText, /make\s+sense\./);
  assert.match(homepage, /Schema review/);
  assert.match(homepage, /INPUT/);
  assert.match(homepage, /EVALUATE/);
  assert.match(homepage, /CLASSIFY/);
  assert.match(homepage, /EXPLAIN/);
  assert.match(homepage, /class="capability-thread" aria-hidden="true"/);
  assert.equal((homepage.match(/class="homepage-demo-card"/g) ?? []).length, 3);
  assert.doesNotMatch(homepage, /class="hero-focus(?:\s|")/);
  assert.doesNotMatch(homepage, /website-work-footer|inline-cv-link/);
  assert.doesNotMatch(footer, /k3-cv\.html/);
});

test("keeps case-study evidence and sparse geometric transitions", () => {
  const wisp = readRoute("case-studies/wisp/index.html");
  const lab = readRoute("case-studies/personal-intelligence-lab/index.html");

  assert.match(wisp, /<strong>101<\/strong>/);
  assert.match(wisp, /<strong>70<\/strong>/);
  assert.match(wisp, /<strong>69\.3%<\/strong>/);
  assert.match(wisp, /<strong>8<\/strong><span>PURCHASE REQUESTS<\/span>/);
  assert.match(wisp, /HISTORICAL, NOT REAL-TIME/);
  assert.match(wisp, /geometric-divider case-transition/);
  assert.match(wisp, /geometric-divider case-transition case-transition-final/);
  assert.match(lab, /geometric-divider case-transition/);
  assert.match(lab, /geometric-divider case-transition case-transition-final/);
  assert.match(wisp, /geometric-divider case-transition[^>]*aria-hidden="true"/);
  assert.match(lab, /case-section shell case-section-orbit/);
});

test("does not export placeholder production links", () => {
  const publicPages = requiredRoutes.map(route => readFileSync(join(outDir.pathname, route), "utf8")).join("\n");
  assert.doesNotMatch(publicPages, /chatgpt\.site|hello@yourdomain\.me|hello@yourbusiness\.com/);
});

test("internal links and hash targets resolve in the static export", () => {
  for (const route of requiredRoutes) {
    const sourcePath = join(outDir.pathname, route);
    const html = readFileSync(sourcePath, "utf8");
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1]);

    for (const href of hrefs) {
      if (/^(?:https?:|mailto:)/.test(href)) continue;
      const [rawPath, hash] = href.split("#");
      let targetPath = sourcePath;

      if (rawPath) {
        const cleanPath = rawPath.replace(/^\//, "").replace(/\/$/, "");
        targetPath = cleanPath === "" ? join(outDir.pathname, "index.html") : cleanPath.includes(".")
          ? join(outDir.pathname, cleanPath)
          : join(outDir.pathname, cleanPath, "index.html");
      }

      assert.equal(existsSync(targetPath), true, `${route}: ${href}`);
      if (hash && targetPath.endsWith(".html")) {
        const targetHtml = readFileSync(targetPath, "utf8");
        assert.match(targetHtml, new RegExp(`id="${hash}"`), `${route}: ${href}`);
      }
    }
  }
});

test("exports the geometric sakura theme and accessible decorative system", () => {
  const homepage = readRoute("index.html");
  const heroArtwork = homepage.match(/<svg class="hero-garden-art"[\s\S]*?<\/svg>/)?.[0] ?? "";
  const cssDir = join(outDir.pathname, "_next/static/css");
  const css = readdirSync(cssDir).filter(file => file.endsWith(".css")).map(file => readFileSync(join(cssDir, file), "utf8")).join("\n");
  const ogImage = readFileSync(join(outDir.pathname, "og-image.svg"), "utf8");

  assert.match(homepage, /hero-garden/);
  assert.match(homepage, /Exact Concept 3 pixel-art sakura branch with four blossoms/);
  assert.match(homepage, /viewBox="0 0 640 600"/);
  assert.match(homepage, /class="hero-garden-signature hero-garden-signature-main"/);
  assert.match(homepage, /M8 8v74M8 46L42 8M8 46l36 36/);
  assert.match(homepage, /translate\(492 470\) scale\(\.62\)/);
  assert.match(heroArtwork, /class="concept3-blossom"/);
  assert.match(heroArtwork, /data-blossom-source="\/k3_concept3_blossom_transparent\.png"/);
  assert.match(heroArtwork, /transform="translate\(53 156\) scale\(\.98\)"/);
  assert.equal((heroArtwork.match(/href="\/k3_concept3_blossom_transparent\.png"/g) ?? []).length, 7);
  assert.equal((heroArtwork.match(/class="concept3-blossom-image concept3-blossom-base"/g) ?? []).length, 1);
  assert.equal((heroArtwork.match(/class="concept3-blossom-image concept3-blossom-glitch/g) ?? []).length, 6);
  assert.equal((heroArtwork.match(/hero-garden-signature-ghost/g) ?? []).length, 3);
  assert.doesNotMatch(homepage, /hero-sakura-petal|hero-sakura-core|hero-garden-grid|hero-garden-nodes|hero-garden-branch|hero-garden-signature-guide|k3-mark-fill|falling-petals|pixel-blossom|data-pixel-group/);
  assert.match(homepage, /sakura-branch/);
  assert.match(homepage, /aria-hidden="true"/);
  assert.match(css, /#f8f5ff/i);
  assert.match(css, /--k3-base:#f8f5ff/);
  assert.match(css, /--k3-secondary:#eee8fa/);
  assert.match(css, /--k3-accent:#4b267d/);
  assert.match(css, /--k3-plum:#211335/);
  assert.match(css, /--k3-muted:#70627f/);
  assert.match(css, /--k3-border:rgba\(75,38,125,.14\)/);
  assert.match(css, /--k3-decoration:rgba\(75,38,125,.2\)/);
  assert.match(css, /--line-hairline:1px/);
  assert.match(css, /--line-soft:1\.25px/);
  assert.match(css, /--line-emphasis:1\.5px/);
  assert.match(css, /--decorative-faint:/);
  assert.match(css, /--decorative-soft:/);
  assert.match(css, /--decorative-visible:/);
  assert.match(css, /\.hero-garden-disc\{[^}]*rgba\(183,156,255,.07\)/);
  assert.match(css, /\.hero-garden-mountains path\{[^}]*stroke:rgba\(75,38,125,.08\)/);
  assert.match(css, /\.hero-garden-signature path\{[^}]*stroke-width:1\.3px/);
  assert.match(css, /\.concept3-blossom-image\{[^}]*image-rendering:pixelated/);
  assert.match(css, /\.concept3-blossom-base\{opacity:1\}/);
  assert.match(css, /\.concept3-blossom-glitch\{opacity:0\}/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(ogImage, /#F8F5FF/);
  assert.match(ogImage, /geometric K3 monogram/);
});

test("exports the exact Concept 3 PNG with temporary controlled glitch layers", () => {
  const homepage = readRoute("index.html");
  const heroArtwork = homepage.match(/<svg class="hero-garden-art"[\s\S]*?<\/svg>/)?.[0] ?? "";
  const cssDir = join(outDir.pathname, "_next/static/css");
  const css = readdirSync(cssDir).filter(file => file.endsWith(".css")).map(file => readFileSync(join(cssDir, file), "utf8")).join("\n");
  const asset = readFileSync(join(outDir.pathname, "k3_concept3_blossom_transparent.png"));
  const assetHash = createHash("sha256").update(asset).digest("hex");
  const assetImages = [...heroArtwork.matchAll(/<image[^>]+href="\/k3_concept3_blossom_transparent\.png"[^>]*>/g)].map(match => match[0]);

  assert.equal(assetHash, "804f3f01bd537a5b3069544a059637c5c35d0c69c8d32529ec7f0a1c7673c43c", "the exported file is byte-identical to the supplied PNG");
  assert.equal(asset.readUInt32BE(16), 534, "asset width remains 534px");
  assert.equal(asset.readUInt32BE(20), 283, "asset height remains 283px");
  assert.equal(asset[25], 6, "asset remains an RGBA PNG");
  assert.equal(assetImages.length, 7, "one untouched base plus six temporary duplicate layers");
  for (const image of assetImages) {
    assert.match(image, /width="534"/);
    assert.match(image, /height="283"/);
    assert.match(image, /preserveAspectRatio="xMidYMid meet"/);
  }
  for (const layer of ["base", "lavender-ghost", "horizontal-tear-a", "horizontal-tear-b", "data-streak-a", "data-streak-b", "data-streak-c"]) {
    assert.match(heroArtwork, new RegExp(`data-blossom-layer="${layer}"`));
  }
  assert.doesNotMatch(heroArtwork, /pixel-blossom|data-pixel-group|data-pixel-kind/);

  assert.match(homepage, /data-glitch-stage="logo"/);
  assert.match(homepage, /data-glitch-phase="stable"/);
  assert.match(homepage, /data-glitch-active="false"/);
  assert.match(homepage, /data-blossom-variant="center-flower-tear"/);
  assert.match(homepage, /data-blossom-debug="false"/);
  assert.match(homepage, /data-glitch-motion="full"/);
  assert.match(homepage, /data-glitch-loop="16000"/);
  assert.match(homepage, /data-glitch-slot="4000"/);
  assert.match(homepage, /class="button primary hero-primary-cta"/);
  assert.match(homepage, /class="hero-cta-label" data-text=/);
  assert.match(homepage, /class="hero-cta-arrow"/);
  assert.match(homepage, /class="hero-glitch-word hero-glitch-target" data-text="Automation"/);
  assert.match(homepage, /class="hero-glitch-word hero-glitch-target" data-text="Product"/);
  assert.match(css, /@keyframes concept3-asset-tear-a/);
  assert.match(css, /@keyframes concept3-asset-tear-b/);
  assert.match(css, /@keyframes concept3-asset-ghost/);
  assert.match(css, /@keyframes concept3-asset-streak/);
  assert.match(css, /@keyframes concept3-asset-aftershock/);
  assert.match(css, /@keyframes k3-signal-main/);
  assert.match(css, /@keyframes k3-signal-slice/);
  assert.match(css, /@keyframes k3-signal-aftershock/);
  assert.match(css, /@keyframes cta-transmission-border/);
  assert.match(css, /@keyframes cta-transmission-scan/);
  assert.match(css, /@keyframes cta-transmission-arrow/);
  assert.match(css, /@keyframes hero-type-corruption/);
  assert.match(css, /@keyframes hero-type-blocks/);
  assert.match(css, /@keyframes hero-type-aftershock/);
  assert.match(css, /animation:concept3-asset-tear-a .45s/);
  assert.match(css, /animation:concept3-asset-ghost .45s/);
  assert.match(css, /animation:k3-signal-main .24s/);
  assert.match(css, /animation:cta-transmission-border .32s/);
  assert.match(css, /animation:hero-type-corruption .28s/);
  assert.doesNotMatch(css, /concept3-blossom-fracture|concept3-blossom-detached|pixel-blossom|blossom-v2|k3-signature-main|cta-label-glitch|hero-word-glitch/);
  assert.match(css, /prefers-reduced-motion:reduce[^}]*[\s\S]*animation:none!important/);
  assert.match(css, /prefers-reduced-motion:reduce[^}]*[\s\S]*\.concept3-blossom-glitch[^}]*opacity:0!important/);
});

test("exports responsive navigation and overflow safeguards without root masking", () => {
  const cssDir = join(outDir.pathname, "_next/static/css");
  const css = readdirSync(cssDir).filter(file => file.endsWith(".css")).map(file => readFileSync(join(cssDir, file), "utf8")).join("\n");

  assert.match(css, /\.site-nav-menu\[hidden\]\{display:none\}/);
  assert.match(css, /\.site-header\{[^}]*width:100%[^}]*background:var\(--k3-base\)/);
  assert.match(css, /\.site-header__inner\{[^}]*background:transparent/);
  assert.match(css, /::-webkit-scrollbar-track\{background:var\(--k3-base\)\}/);
  assert.match(css, /\.site-nav-toggle\{[^}]*width:44px[^}]*height:44px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.doesNotMatch(css, /html\{[^}]*overflow-x:hidden/);
  assert.doesNotMatch(css, /body\{[^}]*overflow-x:hidden/);
  assert.doesNotMatch(css, /\.navlinks\{[^}]*overflow-x:auto/);
});
