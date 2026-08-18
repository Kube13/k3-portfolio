"use client";

import Link from "next/link";
import FreelanceNav from "../FreelanceNav";
import { freelanceCopy } from "../freelance-copy";
import { usePortfolioLanguage } from "../usePortfolioLanguage";

const emailHref = "mailto:kgkhant456@gmail.com?subject=Website%20project%20enquiry";

export default function ServicesPageClient() {
  const { language, chooseLanguage } = usePortfolioLanguage();
  const t = freelanceCopy[language];
  const s = t.services;

  return <main className={`freelance-page ${language === "my" ? "lang-my" : "lang-en"}`}>
    <FreelanceNav language={language} chooseLanguage={chooseLanguage} />

    <header className="subpage-hero shell">
      <span className="index">{s.eyebrow}</span>
      <div className="subpage-hero-grid">
        <h1>{s.title}</h1>
        <div><p>{s.intro}</p><div className="actions"><Link className="button primary" href="/websites">{s.examplesCta} <span>↘</span></Link><a className="button ghost" href={emailHref}>{s.contactCta} <span>↗</span></a></div></div>
      </div>
      <div className="independent-note"><i /><span>{t.common.availability}</span><strong>YANGON / REMOTE</strong></div>
    </header>

    <section className="subpage-section shell" aria-labelledby="services-list-title">
      <div className="subpage-section-head"><div><span className="index">{s.sectionLabel}</span><h2 id="services-list-title">{s.sectionTitle}</h2></div><p>{s.sectionIntro}</p></div>
      <div className="service-card-grid">{s.categories.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
    </section>

    <section className="foundation-band"><div className="shell foundation-grid"><div><span className="index">{s.includedLabel}</span><h2>{s.includedTitle}</h2></div><ul>{s.included.map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></div></section>

    <section className="subpage-section shell" aria-labelledby="service-process-title">
      <div className="subpage-section-head compact"><div><span className="index">{s.processLabel}</span><h2 id="service-process-title">{s.processTitle}</h2></div></div>
      <ol className="service-process">{s.process.map((item, index) => <li key={item.step}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.step}</h3><p>{item.body}</p></li>)}</ol>
      <p className="scope-note">{s.boundary}</p>
    </section>

    <section className="subpage-cta"><div className="shell"><div><span className="index">{t.nav.contact}</span><h2>{s.finalTitle}</h2></div><div><p>{s.finalBody}</p><a className="button light" href={emailHref}>{t.common.email} <span>↗</span></a><Link className="cta-secondary" href="/websites">{s.examplesCta} <span>→</span></Link></div></div></section>
    <footer className="footer shell"><Link className="brand" href="/"><span>K3</span><i /></Link><p>Data Analyst · Automation Engineer · Product Builder</p><div><Link href="/services">{t.nav.services}</Link><Link href="/websites">{t.nav.websites}</Link><a href="mailto:kgkhant456@gmail.com">Email</a></div><small>© 2026 K3 · Yangon, Myanmar.</small></footer>
  </main>;
}
