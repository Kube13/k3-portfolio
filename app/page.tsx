"use client";

import Link from "next/link";
import WispMotionPreview from "./WispMotionPreview";
import WebsitePreview, { type WebsitePreviewSlug } from "./WebsitePreview";
import { portfolioCopy } from "./portfolio-copy";
import { usePortfolioLanguage } from "./usePortfolioLanguage";
import { HeroGarden, SakuraBranch, SectionOrnament } from "./decorative/SakuraGeometry";
import SiteNav from "./SiteNav";

const websiteSlugs: WebsitePreviewSlug[] = ["cafe", "restaurant", "law-firm"];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "K3",
  url: "https://k3labs.me/",
  jobTitle: "Data Analyst & Automation Engineer",
  sameAs: [
    "https://www.linkedin.com/in/kaung-khant-kyaw-658a4a203/",
    "https://github.com/Kube13",
  ],
  knowsAbout: ["Data analysis", "Product analytics", "Business analysis", "Python automation", "Applied AI"],
};

function DataWorkflowPreview({ language }: { language: "en" | "my" }) {
  const steps = language === "my"
    ? ["Schema စစ်ဆေးမှု", "Missing value စစ်ဆေးမှု", "Duplicate စစ်ဆေးမှု", "ပြင်ဆင်ထားသော dataset"]
    : ["Schema review", "Missing-value review", "Duplicate review", "Prepared dataset"];

  return <div className="project-system-preview data-preview" aria-hidden="true">
    <div className="system-preview-head"><span>PERSONAL INTELLIGENCE LAB</span><span>WORKFLOW PREVIEW</span></div>
    <div className="data-preview-body">
      <div className="data-preview-table"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <ol>{steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><b>{step}</b><i>✓</i></li>)}</ol>
    </div>
  </div>;
}

function ClassificationPreview() {
  return <div className="project-system-preview classification-preview" aria-hidden="true">
    <div className="system-preview-head"><span>CATEGORY CLASSIFICATION</span><span>REPEATABLE PIPELINE</span></div>
    <div className="classification-flow">
      <div><small>01</small><b>INPUT</b></div><i>→</i>
      <div><small>02</small><b>EVALUATE</b></div><i>→</i>
      <div><small>03</small><b>CLASSIFY</b></div><i>→</i>
      <div><small>04</small><b>EXPLAIN</b></div>
    </div>
  </div>;
}

export default function Home() {
  const { language, chooseLanguage } = usePortfolioLanguage();
  const t = portfolioCopy[language];
  const selectedProjects = t.work.projects.slice(0, 2);
  const websiteExamples = t.demos.items.slice(0, 3);
  const navigationLinks = [
    { href: "#work", label: t.nav.work },
    { href: "#capabilities", label: t.capabilities.label },
    { href: "/websites", label: t.nav.websites },
    { href: "#about", label: t.nav.about },
    { href: "#contact", label: t.nav.contact },
  ];

  return <main className={language === "my" ? "lang-my" : "lang-en"}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

    <SiteNav
      language={language}
      chooseLanguage={chooseLanguage}
      links={navigationLinks}
      languageLabel={language === "my" ? "ဘာသာစကား ရွေးချယ်ရန်" : "Choose language"}
      navigationLabel={language === "my" ? "အဓိက လမ်းညွှန်" : "Primary navigation"}
      brandHref="#top"
      availabilityLabel={t.nav.available}
    />

    <header className="hero hero-focused shell" id="top">
      <div className="eyebrow"><span>{t.hero.eyebrow}</span><span>{t.hero.version}</span></div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 className="hero-role">{t.hero.kicker}</h1>
          <p className="hero-statement">{t.hero.titleLead}<em>{t.hero.titleAccent}</em></p>
          <p className="hero-intro">{t.hero.body}</p>
          <div className="actions"><Link className="button primary" href="#work">{t.hero.workCta} <span>↘</span></Link><a className="button ghost" href="/k3-cv.html" download>{t.hero.cvCta} <span>↓</span></a></div>
        </div>
        <HeroGarden />
      </div>
    </header>

    <section className="section shell selected-work" id="work">
      <SakuraBranch className="section-branch work-branch" />
      <div className="section-head"><div><span className="index">{t.work.label}</span><h2>{t.work.title}</h2></div><p>{t.work.intro}</p></div>
      <article className="feature-card">
        <div className="feature-copy">
          <div className="tags"><span>{t.work.flagship}</span><span>{t.work.live}</span></div>
          <h3>Wisp</h3>
          <p className="project-role">{t.work.wispRole}</p>
          <p className="lede">{t.work.wispLede}</p>
          <p>{t.work.wispBody}</p>
          <div className="metric-context">{t.work.metricContext}</div>
          <div className="metrics"><div><strong>101</strong><small>{t.work.metrics[0]}</small></div><div><strong>70</strong><small>{t.work.metrics[1]}</small></div><div><strong>69.3%</strong><small>{t.work.metrics[2]}</small></div></div>
          <div className="feature-links"><Link className="text-link" href="/case-studies/wisp">{t.work.caseStudy} <span>→</span></Link><a className="text-link" href="https://wispguide.com/" target="_blank" rel="noreferrer">{t.work.liveProduct} <span>↗</span></a></div>
        </div>
        <div className="feature-visual"><WispMotionPreview language={language} /></div>
      </article>

      <div className="selected-project-grid">
        {selectedProjects.map((project, index) => <article className="selected-project" key={project.name}>
          <div className="selected-project-visual">{index === 0 ? <DataWorkflowPreview language={language} /> : <ClassificationPreview />}</div>
          <div className="selected-project-copy">
            <div className="project-meta"><small>{project.type}</small></div>
            <h3>{project.name}</h3><p className="project-role">{project.role}</p><p>{project.line}</p>
            <div className="tool-row">{project.tools.map(tool => <span key={tool}>{tool}</span>)}</div>
            {index === 0
              ? <Link className="card-link" href="/case-studies/personal-intelligence-lab">{t.work.caseStudy} <span>→</span></Link>
              : <a className="card-link" href="https://github.com/Kube13" target="_blank" rel="noreferrer">{t.work.viewBuild} <span>↗</span></a>}
          </div>
        </article>)}
      </div>
    </section>
    <SectionOrnament />

    <section className="section capabilities" id="capabilities"><div className="shell"><div className="section-head"><div><span className="index">{t.capabilities.label}</span><h2>{t.capabilities.title}</h2></div><p>{t.capabilities.intro}</p></div><div className="capability-thread" aria-hidden="true"><span /><i /><i /></div><div className="cap-grid">{t.capabilities.items.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>

    <section className="section shell website-work" id="websites">
      <div className="section-head"><div><span className="index">{t.demos.label}</span><h2>{t.demos.title}</h2></div><div className="section-side"><p>{t.demos.intro}</p><Link className="section-route-link" href="/websites">{t.demos.allExamples} <span>→</span></Link></div></div>
      <div className="homepage-demo-grid homepage-demo-teaser">{websiteExamples.map((demo, index) => <Link className="homepage-demo-card" href={`/demos/${websiteSlugs[index]}`} key={demo.slug}>
        <WebsitePreview slug={websiteSlugs[index]} />
        <div><span>{t.demos.demoLabel} · {demo.type}</span><h3>{demo.name}</h3></div>
      </Link>)}</div>
      <div className="website-teaser-actions"><Link className="button primary" href="/websites">{t.freelance.examplesCta} <span>→</span></Link><Link className="button ghost" href="/services">{t.freelance.servicesCta} <span>↗</span></Link></div>
    </section>

    <section className="section shell about-section about-brief" id="about">
      <div><span className="index">{t.about.label}</span><h2>{t.about.title}</h2></div>
      <div className="about-copy">{t.about.paragraphs.slice(0, 2).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>

    <section className="contact dual-contact" id="contact"><div className="shell">
      <article><span className="index">{t.contact.candidateLabel}</span><h2>{t.contact.candidateTitle}</h2><p>{t.contact.body}</p><div className="contact-actions"><a className="button light" href="/k3-cv.html" download>{t.contact.cv} <span>↓</span></a><a className="contact-link" href="https://www.linkedin.com/in/kaung-khant-kyaw-658a4a203/" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a></div></article>
      <article><span className="index">{t.contact.clientLabel}</span><h2>{t.contact.clientTitle}</h2><p>{t.contact.clientBody}</p><div className="contact-actions"><a className="button light" href="mailto:kgkhant456@gmail.com?subject=Website%20or%20automation%20project">{t.contact.discussProject} <span>↗</span></a><Link className="contact-link" href="/services">{t.contact.viewServices} <span>→</span></Link></div></article>
    </div></section>

    <footer className="footer shell"><SakuraBranch className="footer-branch" /><Link className="brand" href="#top"><span>K3LABS</span><i /></Link><p>{t.contact.footerRole}</p><div><a href="https://www.linkedin.com/in/kaung-khant-kyaw-658a4a203/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/Kube13" target="_blank" rel="noreferrer">GitHub</a><a href="mailto:kgkhant456@gmail.com">Email</a></div><small>© 2026 K3Labs · Yangon, Myanmar.</small></footer>
  </main>;
}
