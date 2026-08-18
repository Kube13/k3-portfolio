import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";
import { siteConfig } from "../site";

export const metadata: Metadata = {
  title: "Freelance Website Development & Automation Services | K3",
  description: "Freelance website development for small businesses and professionals, including responsive websites, landing pages, deployment, SEO setup, analytics and lightweight automation.",
  alternates: {
    canonical: "/services/",
  },
  openGraph: {
    title: "Freelance Website Development & Automation Services | K3",
    description: "Freelance website development for small businesses and professionals, including responsive websites, landing pages, deployment, SEO setup, analytics and lightweight automation.",
    url: "/services/",
    siteName: siteConfig.name,
    type: "website",
    images: [siteConfig.ogImage],
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
