import type { Metadata } from "next";
import "./globals.css";
import "./detail.css";
import "./iso-theme.css";
import "./freelance.css";
import "./portfolio-refresh.css";
import "./sakura.css";
import { defaultMetadata, siteConfig } from "./site";

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: defaultMetadata.title,
  description: defaultMetadata.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    images: [siteConfig.ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
