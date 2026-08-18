export const siteConfig = {
  name: "K3 Portfolio",
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://k3-portfolio.pages.dev"),
  ogImage: {
    url: "/og-image.svg",
    width: 1200,
    height: 630,
    alt: "K3 portfolio",
  },
};

export const defaultMetadata = {
  title: "K3 — Data Analyst, Automation Engineer & Product Builder",
  description:
    "Portfolio of K3, a Yangon-based data and business analyst, automation engineer, and product builder. Explore Wisp, analytics and AI systems, plus freelance website development.",
};
