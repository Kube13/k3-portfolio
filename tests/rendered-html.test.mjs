import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const outDir = new URL("../out/", import.meta.url);
const requiredRoutes = [
  "index.html",
  "services/index.html",
  "websites/index.html",
  "case-studies/wisp/index.html",
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

  assert.match(homepage, /Data Analyst, Automation Engineer &amp; Product Builder/);
  assert.match(homepage, /<meta property="og:title"/);
  assert.match(homepage, /<link rel="canonical"/);

  assert.equal(existsSync(join(outDir.pathname, "robots.txt")), true);
  assert.equal(existsSync(join(outDir.pathname, "sitemap.xml")), true);
  assert.equal(existsSync(join(outDir.pathname, "k3-cv.html")), true);
  assert.equal(existsSync(join(outDir.pathname, "datacamp-python-data-associate.pdf")), true);
});
