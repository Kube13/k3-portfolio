import type { MetadataRoute } from "next";
import { siteConfig } from "./site";

export const dynamic = "force-static";

const routes = [
  "/",
  "/services/",
  "/websites/",
  "/case-studies/wisp/",
  "/case-studies/personal-intelligence-lab/",
  "/demos/cafe/",
  "/demos/restaurant/",
  "/demos/law-firm/",
  "/demos/shop/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified: new Date("2026-08-21"),
  }));
}
