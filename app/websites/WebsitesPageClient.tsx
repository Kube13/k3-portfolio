"use client";

import Link from "next/link";
import FreelanceNav from "../FreelanceNav";
import { freelanceCopy } from "../freelance-copy";
import { usePortfolioLanguage } from "../usePortfolioLanguage";

const emailHref = "mailto:kgkhant456@gmail.com?subject=Website%20project%20enquiry";

export default function WebsitesPageClient() {
  const { language, chooseLanguage } = usePortfolioLanguage();
  const t = freelanceCopy[language];
  const w = t.websites;

  return <main className={`freelance-page ${language === "my" ? "lang-my" : "lang-en"}`}>
    <FreelanceNav language={language} chooseLanguage={chooseLanguage} />

    <header className="subpage-hero websites-hero shell">
      <span className="index">{w.eyebrow}</span>
      <div className="subpage-hero-grid">
        <h1>{w.title}</h1>
        <div><p>{w.intro}</p><div className="actions"><Link className="button primary" href="/services">{w.servicesCta} <span>↘</span></Link><a className="button ghost" href={emailHref}>{w.contactCta} <span>↗</span></a></div></div>
      </div>
      <p className="demo-disclaimer"><strong>{t.common.demo}</strong>{w.disclaimer}</p>
    </header>

    <section className="subpage-section shell" aria-labelledby="website-list-title">
      <div className="subpage-section-head"><div><span className="index">{w.sectionLabel}</span><h2 id="website-list-title">{w.sectionTitle}</h2></div><p>{w.capabilityLabel}: {w.capabilities.join(" · ")}</p></div>
      <div className="website-card-grid">{w.items.map((item, index) => {
        const content = <>
          <div className={`website-card-art ${item.accent}`}><span>{item.name.charAt(0)}</span><small>{item.type}</small></div>
          <div className="website-card-copy"><div><span>{item.slug ? t.common.demo : t.common.planned}</span><b>{String(index + 1).padStart(2, "0")}</b></div><h3>{item.name}</h3><p>{item.body}</p><strong>{item.slug ? `${w.viewDemo} ↗` : w.plannedNote}</strong></div>
        </>;
        return item.slug ? <Link className="website-card" href={`/demos/${item.slug}`} key={item.name}>{content}</Link> : <article className="website-card planned-card" key={item.name}>{content}</article>;
      })}</div>
    </section>

    <section className="subpage-cta"><div className="shell"><div><span className="index">{t.nav.contact}</span><h2>{w.finalTitle}</h2></div><div><p>{w.finalBody}</p><a className="button light" href={emailHref}>{w.contactCta} <span>↗</span></a><Link className="cta-secondary" href="/services">{w.servicesCta} <span>→</span></Link></div></div></section>
    <footer className="footer shell"><Link className="brand" href="/"><span>K3</span><i /></Link><p>Data Analyst · Automation Engineer · Product Builder</p><div><Link href="/services">{t.nav.services}</Link><Link href="/websites">{t.nav.websites}</Link><a href="mailto:kgkhant456@gmail.com">Email</a></div><small>© 2026 K3 · Yangon, Myanmar.</small></footer>
  </main>;
}
