import Link from "next/link";
import type { Metadata } from "next";
import WispMotionPreview from "../../WispMotionPreview";
import { siteConfig } from "../../site";
import { SakuraBranch, SectionOrnament } from "../../decorative/SakuraGeometry";

const title = "Wisp Case Study | Product Analytics, AI & Automation | K3";
const description = "How I designed and built Wisp Guide, a psychology-focused product combining behavioral logic, product analytics, automation, localization and applied AI.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/case-studies/wisp/" },
  openGraph: {
    title,
    description,
    url: "/case-studies/wisp/",
    siteName: siteConfig.name,
    type: "article",
    images: [siteConfig.ogImage],
  },
  twitter: { card: "summary_large_image", title, description, images: [siteConfig.ogImage.url] },
};

const story = [
  { number: "01", title: "Overview", body: "Wisp Guide is a bilingual relationship self-insight product for Myanmar users. I owned the product flow, behavioral logic, UX writing, analytics, authentication, paid-session operations, AI-personalization architecture, and production delivery." },
  { number: "02", title: "The problem", body: "Relationship advice is often generic, while clinical language can feel distant. The experience needed to make a sensitive subject approachable and private without presenting a result as diagnosis or therapy." },
  { number: "03", title: "The product", body: "A guided 23-question assessment turns structured responses about connection, conflict, trust, closeness, and emotional safety into an understandable relationship-pattern result and practical next steps." },
  { number: "04", title: "Assessment flow", body: "The flow reduces a complex topic into one decision at a time: answer the assessment, classify the primary and secondary patterns, explain the result, then offer a clear next action." },
];

const operations = [
  { number: "07", title: "Admin & operations", body: "The product includes the operational path around paid sessions, purchase requests, administration, release workflow, and cost controls—not only the user-facing assessment." },
  { number: "08", title: "Authentication & ownership", body: "Google authentication and SQLite-backed ownership connect a result to the right user while keeping access and operational data within the product system." },
  { number: "09", title: "Localization", body: "English and Burmese are treated as product states rather than an afterthought. Assessment content, result wording, and guidance are designed to remain understandable across both languages." },
  { number: "10", title: "Production delivery", body: "React interfaces, a Python/FastAPI service, SQLite data, Cloudflare delivery, and a secured VPS release workflow form one deployable product chain." },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  dateModified: "2026-08-21",
  author: { "@type": "Person", name: "K3", url: "https://k3labs.me/" },
  mainEntityOfPage: "https://k3labs.me/case-studies/wisp/",
};

export default function WispCaseStudy() {
  return <main className="case">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    <nav className="case-nav shell" aria-label="Case study navigation"><Link className="brand" href="/"><span>K3LABS</span><i /></Link><Link href="/#work">← All selected work</Link></nav>

    <header className="case-hero shell">
      <SakuraBranch className="case-hero-sakura" />
      <span>WISP GUIDE · FLAGSHIP CASE STUDY · 2026</span>
      <h1>Wisp</h1>
      <p>Building a bilingual psychology product from behavioral logic to a measurable, deployable system.</p>
      <div><b>ROLE</b> Product owner · Product analytics · UX · Systems · Build</div>
      <div className="case-snapshot">FUNNEL SNAPSHOT · AUGUST 2026 · HISTORICAL, NOT REAL-TIME</div>
    </header>

    <section className="case-metrics" aria-label="Wisp funnel snapshot from August 2026"><div className="shell">
      <article><strong>101</strong><span>RECORDED STARTS</span></article>
      <article><strong>70</strong><span>COMPLETIONS</span></article>
      <article><strong>69.3%</strong><span>COMPLETION RATE</span></article>
      <article><strong>8</strong><span>PURCHASE REQUESTS</span></article>
    </div></section>
    <SectionOrnament />

    <section className="case-visual"><div className="shell">
      <div className="case-visual-head"><div><span className="case-section-label">PRODUCT VIEW</span><h2>From structured answers to useful guidance.</h2></div><p>This interactive system view uses the existing product flow to show the input, deterministic logic, and controlled output without inventing product screenshots.</p></div>
      <div className="feature-visual"><WispMotionPreview language="en" /></div>
    </div></section>

    <section className="case-section shell" aria-label="Wisp overview and product story"><div className="case-story">
      {story.map(item => <article key={item.number}><span>{item.number}</span><h2>{item.title}</h2><p>{item.body}</p></article>)}
    </div></section>

    <section className="case-diagram shell" aria-labelledby="architecture-title">
      <span>05 · SYSTEM ARCHITECTURE</span>
      <h2 id="architecture-title">A product chain with explicit responsibilities.</h2>
      <div className="architecture-grid" role="img" aria-label="Architecture flow from bilingual React interface through FastAPI logic and SQLite data to Cloudflare and secured VPS delivery">
        <article><span>INTERFACE</span><strong>React · EN / MY</strong><small>Assessment, results, account and payment journeys</small></article><i>→</i>
        <article><span>APPLICATION</span><strong>Python · FastAPI</strong><small>Behavior logic, controlled personalization and API services</small></article><i>→</i>
        <article><span>OWNERSHIP</span><strong>SQLite · Auth</strong><small>User access, results, analytics events and operations</small></article><i>→</i>
        <article><span>DELIVERY</span><strong>Cloudflare · VPS</strong><small>Public delivery and secured release workflow</small></article>
      </div>
    </section>

    <section className="case-section shell" aria-label="Decision logic and AI personalization"><div className="case-split">
      <article><span className="case-section-label">06 · BEHAVIOR / DECISION LOGIC</span><h2>Classification stays deterministic.</h2><p className="case-section-copy">Structured psychology rules compare answer signals to identify the primary pattern, secondary tendencies, triggers, and emotional needs. The core classification is reproducible and does not depend on generative output.</p></article>
      <article><span className="case-section-label">AI PERSONALIZATION</span><h2>AI works inside a controlled boundary.</h2><p className="case-section-copy">AI supports explanation and tone after the structured result is known. Approved wording, explicit product limits, and fallback content keep personalization from becoming diagnosis or uncontrolled classification.</p></article>
    </div></section>

    <section className="case-diagram shell" aria-labelledby="analytics-title">
      <span>PRODUCT ANALYTICS · AUGUST 2026 SNAPSHOT</span>
      <h2 id="analytics-title">The funnel shows where users progressed.</h2>
      <p className="case-section-copy">These verified historical counts provide iteration evidence. They are presented as a dated snapshot and are not implied to be live metrics.</p>
      <div className="funnel-evidence">
        <article><strong>101</strong><span>STARTED</span></article><i>→</i>
        <article><strong>70</strong><span>COMPLETED</span></article><i>→</i>
        <article><strong>69.3%</strong><span>START-TO-COMPLETE</span></article><i>→</i>
        <article><strong>8</strong><span>PURCHASE REQUESTS</span></article>
      </div>
    </section>

    <section className="case-section shell" aria-label="Operations, ownership, localization and delivery"><div className="case-story">
      {operations.map(item => <article key={item.number}><span>{item.number}</span><h2>{item.title}</h2><p>{item.body}</p></article>)}
    </div></section>

    <section className="case-result"><div className="shell case-result-grid">
      <div><span className="case-evidence-label">11 · RESULTS</span><h2>A working product with evidence for the next iteration.</h2><p>Wisp moved beyond a concept into a bilingual, authenticated product with a measurable assessment funnel and an operational path around paid guidance.</p></div>
      <ul><li><span>01</span> Live English and Burmese product flow</li><li><span>02</span> Verified 101-start / 70-completion snapshot</li><li><span>03</span> Deterministic classification with controlled AI support</li><li><span>04</span> Authentication, ownership, analytics, and operations</li></ul>
    </div></section>

    <section className="case-section shell"><div className="case-split">
      <article><span className="case-section-label">12 · WHAT I LEARNED</span><h2>The product is the whole chain.</h2><p className="case-section-copy">The strongest product work is not a screen. It is the connection between user need, decision logic, careful wording, operations, measurement, and sustainable delivery.</p></article>
      <article><span className="case-section-label">EXPLORE NEXT</span><h2>See the analytics workflow.</h2><p className="case-section-copy">Personal Intelligence Lab documents how raw datasets move through profiling, cleaning, analysis, KPI framing, and decision-ready reporting.</p><div className="case-links"><Link className="card-link" href="/case-studies/personal-intelligence-lab">Explore my data analytics work <span>→</span></Link></div></article>
    </div></section>

    <footer className="case-end"><div className="shell"><span>NEXT STEP</span><h2>Want to discuss the work?</h2><div className="case-end-links"><a href="mailto:kgkhant456@gmail.com?subject=Wisp%20case%20study">Email K3 ↗</a><Link href="/#work">View other projects →</Link></div></div></footer>
  </main>;
}
