import type { Metadata } from "next";
import WebsitesPageClient from "./WebsitesPageClient";
import { siteConfig } from "../site";

export const metadata: Metadata = {
  title: "Website Design Concepts & Demos | K3",
  description: "Responsive website concepts and demos for cafes, restaurants, professional services, local shops, portfolios and small-business landing pages by a freelance website developer in Yangon.",
  alternates: {
    canonical: "/websites/",
  },
  openGraph: {
    title: "Website Design Concepts & Demos | K3",
    description: "Responsive website concepts and demos for cafes, restaurants, professional services, local shops, portfolios and small-business landing pages by a freelance website developer in Yangon.",
    url: "/websites/",
    siteName: siteConfig.name,
    type: "website",
    images: [siteConfig.ogImage],
  },
};

export default function WebsitesPage() {
  return <WebsitesPageClient />;
}
