import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "../../site";
import { GeometricDivider, SakuraBranch, SectionOrnament } from "../../decorative/SakuraGeometry";

const title = "Personal Intelligence Lab | Data Analytics Case Study | K3";
const description = "A data analytics case study covering data quality profiling, cleaning, transformation, exploratory analysis and decision-ready reporting.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/case-studies/personal-intelligence-lab/" },
  openGraph: {
    title,
    description,
    url: "/case-studies/personal-intelligence-lab/",
    siteName: siteConfig.name,
    type: "article",
    images: [siteConfig.ogImage],
  },
  twitter: { card: "summary_large_image", title, description, images: [siteConfig.ogImage.url] },
};

const workflow = [
  "Raw dataset",
  "Data quality profile",
  "Missing values",
  "Duplicates",
  "Cleaning",
  "Transformations",
  "Exploratory analysis",
  "KPI framing",
  "Reporting",
  "Business interpretation",
];

const caseStudy = [
  { number: "01", title: "Problem", body: "Unfamiliar datasets create two linked problems: analysts need to establish whether the data is trustworthy, while decision-makers need a concise explanation of what the data can safely support." },
  { number: "02", title: "Raw dataset", body: "The workflow begins with source context, schema, field types, row-level inspection, and an explicit record of assumptions. Analysis does not begin by jumping directly to a chart." },
  { number: "03", title: "Data quality profiling", body: "A guided profile brings structure, type consistency, missingness, duplicates, and suspicious values into one review so the analyst can decide what requires attention." },
  { number: "04", title: "Missing values", body: "Missing data is treated as a decision point. The workflow is designed to expose where values are absent and make the chosen handling rule visible rather than silently filling or dropping records." },
  { number: "05", title: "Duplicates", body: "Potential duplicate rows are separated from confirmed duplicates. The intended review preserves traceability before any destructive cleaning choice is applied." },
  { number: "06", title: "Cleaning & transformations", body: "Cleaning steps are sequenced and reviewable: normalize types and labels, resolve selected quality issues, create analysis-ready fields, and preserve the relationship to the source." },
  { number: "07", title: "Exploratory analysis", body: "The analysis layer is structured around distributions, segments, relationships, and anomalies that can answer a real question—not around producing the largest possible number of charts." },
  { number: "08", title: "KPIs", body: "Measures are framed with a definition, grain, time basis, and interpretation so a dashboard number can be understood and challenged instead of acting as decoration." },
  { number: "09", title: "Visualization & reporting", body: "The reporting direction pairs a compact KPI view with supporting evidence and source context, moving from the answer to the drivers and then to appropriate caveats." },
  { number: "10", title: "Business interpretation", body: "The final layer translates validated analytical findings into a decision, recommendation, or next question while separating evidence from inference." },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  dateModified: "2026-08-21",
  author: { "@type": "Person", name: "K3", url: "https://k3labs.me/" },
  mainEntityOfPage: "https://k3labs.me/case-studies/personal-intelligence-lab/",
};

export default function PersonalIntelligenceLabCaseStudy() {
  return <main className="case lab-case">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
    <nav className="case-nav shell" aria-label="Case study navigation"><Link className="brand" href="/"><span>K3LABS</span><i /></Link><Link href="/#work">← All selected work</Link></nav>

    <header className="case-hero shell">
      <SakuraBranch className="case-hero-sakura" />
      <span>DATA ANALYTICS CASE STUDY · SYSTEM IN DEVELOPMENT</span>
      <h1>Personal<br />Intelligence Lab</h1>
      <p>A guided analytical workspace for moving from an unfamiliar dataset to evidence that is ready to support a decision.</p>
      <div><b>ROLE</b> Data workflow design · Analysis · Product build</div>
      <div className="lab-status" aria-label="Project status">
        <div><span>STATUS</span><strong>In development</strong></div>
        <div><span>CURRENT EVIDENCE</span><strong>Defined analytical workflow</strong></div>
        <div><span>NEXT PROOF</span><strong>Validated dataset outputs</strong></div>
      </div>
    </header>
    <SectionOrnament />

    <section className="case-visual"><div className="shell">
      <div className="case-visual-head"><div><span className="case-section-label">ANALYTICAL WORKBENCH</span><h2>Quality before conclusions.</h2></div><p>This code-derived workflow view describes the current product direction. It intentionally contains no fabricated dataset values, dashboard results, or performance claims.</p></div>
      <div className="lab-workbench" role="img" aria-label="Personal Intelligence Lab workflow showing dataset profiling, quality review, cleaning, analysis, KPIs and reporting">
        <aside><span>ANALYSIS WORKFLOW · 01—10</span><ol>{workflow.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, "0")}</b>{step}</li>)}</ol></aside>
        <div className="lab-workbench-main">
          <div className="lab-workbench-head"><span>DATA QUALITY PROFILE</span><span>REVIEW STATE · NO SAMPLE VALUES</span></div>
          <div className="lab-profile-grid"><div><span>SCHEMA</span><strong>Types & grain</strong></div><div><span>COMPLETENESS</span><strong>Missing-value review</strong></div><div><span>UNIQUENESS</span><strong>Duplicate review</strong></div></div>
          <div className="lab-table">{Array.from({ length: 20 }, (_, index) => <i key={index} />)}</div>
          <p className="evidence-boundary">Evidence boundary: the portfolio repository does not contain a validated source dataset or exported analysis screenshots. Those outputs should be added here only after they can be traced to a real analysis run.</p>
        </div>
      </div>
    </div></section>

    <section className="case-section shell case-section-orbit" aria-label="Analytics workflow">
      <div className="case-story">{caseStudy.map(item => <article key={item.number}><span>{item.number}</span><h2>{item.title}</h2><p>{item.body}</p></article>)}</div>
    </section>
    <GeometricDivider className="case-transition" />

    <section className="case-diagram shell" aria-labelledby="lab-flow-title">
      <span>ANALYSIS FLOW</span>
      <h2 id="lab-flow-title">From source context to a decision-ready report.</h2>
      <div className="architecture-grid" role="img" aria-label="Analytics flow from raw data through profiling and preparation to analysis and reporting">
        <article><span>INGEST</span><strong>Raw data</strong><small>Source, schema, grain, assumptions</small></article><i>→</i>
        <article><span>VALIDATE</span><strong>Quality profile</strong><small>Types, missingness, duplicates, suspicious values</small></article><i>→</i>
        <article><span>ANALYZE</span><strong>EDA & KPIs</strong><small>Patterns, segments, definitions, context</small></article><i>→</i>
        <article><span>COMMUNICATE</span><strong>Decision-ready report</strong><small>Answer, evidence, caveats, next action</small></article>
      </div>
    </section>

    <section className="case-result"><div className="shell case-result-grid">
      <div><span className="case-evidence-label">CURRENT RESULT</span><h2>An honest foundation for reproducible analysis.</h2><p>The current case study establishes the workflow, quality gates, and reporting standard. It does not claim a finished dashboard or quantified business outcome before those artifacts exist.</p></div>
      <ul><li><span>01</span> Explicit data-quality checks before analysis</li><li><span>02</span> Reviewable cleaning and transformation decisions</li><li><span>03</span> KPI definitions connected to business questions</li><li><span>04</span> Clear separation between evidence and inference</li></ul>
    </div></section>
    <GeometricDivider className="case-transition case-transition-final" />

    <footer className="case-end"><div className="shell"><span>EXPLORE NEXT</span><h2>See product ownership in practice.</h2><div className="case-end-links"><Link href="/case-studies/wisp">View Wisp case study →</Link><Link href="/#work">View other projects →</Link></div></div></footer>
  </main>;
}
