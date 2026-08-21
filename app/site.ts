export const siteConfig = {
  name: "K3Labs Portfolio",
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://k3labs.me"),
  ogImage: {
    url: "/og-image.svg",
    width: 1200,
    height: 630,
    alt: "K3Labs geometric sakura portfolio",
  },
};

export const defaultMetadata = {
  title: "K3 — Data Analyst & Automation Engineer · Product Builder",
  description:
    "Portfolio of K3, a Yangon-based Data Analyst & Automation Engineer and product builder. Explore Wisp, analytics and automation systems, plus freelance website development.",
};
