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
  const wisp = readFileSync(join(outDir.pathname, "case-studies/wisp/index.html"), "utf8");
  const lab = readFileSync(join(outDir.pathname, "case-studies/personal-intelligence-lab/index.html"), "utf8");

  assert.match(wisp, /Wisp Case Study \| Product Analytics, AI &amp; Automation \| K3/);
  assert.match(wisp, /FUNNEL SNAPSHOT · AUGUST 2026/);
  assert.match(lab, /Personal Intelligence Lab \| Data Analytics Case Study \| K3/);
  assert.match(lab, /SYSTEM IN DEVELOPMENT/);
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
  const homepage = readFileSync(join(outDir.pathname, "index.html"), "utf8");
  const cssDir = join(outDir.pathname, "_next/static/css");
  const css = readdirSync(cssDir).filter(file => file.endsWith(".css")).map(file => readFileSync(join(cssDir, file), "utf8")).join("\n");
  const ogImage = readFileSync(join(outDir.pathname, "og-image.svg"), "utf8");

  assert.match(homepage, /hero-garden/);
  assert.match(homepage, /sakura-branch/);
  assert.match(homepage, /aria-hidden="true"/);
  assert.match(css, /#f8f5ff/i);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(ogImage, /#F8F5FF/);
  assert.match(ogImage, /geometric K3 monogram/);
});
