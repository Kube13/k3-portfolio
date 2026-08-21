import assert from "node:assert/strict";
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
  assert.match(homepage, /systems that/);
  assert.match(homepage, /make sense\./);
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
  const cssDir = join(outDir.pathname, "_next/static/css");
  const css = readdirSync(cssDir).filter(file => file.endsWith(".css")).map(file => readFileSync(join(cssDir, file), "utf8")).join("\n");
  const ogImage = readFileSync(join(outDir.pathname, "og-image.svg"), "utf8");

  assert.match(homepage, /hero-garden/);
  assert.match(homepage, /viewBox="0 0 320 300"/);
  assert.match(homepage, /M34 28h42v96l72-96h51l-91 119 84 125h-54l-62-94v94H34Z/);
  assert.match(homepage, /M213 61c45-3 76 18 76 54/);
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
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(ogImage, /#F8F5FF/);
  assert.match(ogImage, /geometric K3 monogram/);
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
