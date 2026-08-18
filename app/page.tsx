"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import WispMotionPreview from "./WispMotionPreview";
import { Language, portfolioCopy } from "./portfolio-copy";

const skillLabels = ["SQL", "Power BI", "Python", "Pandas", "React", "FastAPI", "APIs", "Git / GitHub", "Figma", "KPI design"];

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const t = portfolioCopy[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("k3-portfolio-language");
    const initialLanguage = saved === "my" ? "my" : "en";
    document.documentElement.lang = initialLanguage;
    if (initialLanguage !== language) {
      window.setTimeout(() => setLanguage(initialLanguage), 0);
    }
  }, [language]);

  const chooseLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("k3-portfolio-language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  return <main className={language === "my" ? "lang-my" : "lang-en"}>
    <nav className="nav shell" aria-label={language === "my" ? "အဓိက လမ်းညွှန်" : "Primary navigation"}>
      <Link className="brand" href="#top" aria-label="K3 home"><span>K3</span><i /></Link>
      <div className="navlinks"><Link href="#work">{t.nav.work}</Link><Link href="/services">{t.nav.services}</Link><Link href="/websites">{t.nav.websites}</Link><Link href="#about">{t.nav.about}</Link><Link href="#contact">{t.nav.contact}</Link></div>
      <div className="nav-actions">
        <div className="language-switch" role="group" aria-label={language === "my" ? "ဘာသာစကား ရွေးချယ်ရန်" : "Choose language"}>
          <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => chooseLanguage("en")} aria-pressed={language === "en"}>EN</button>
          <button type="button" className={language === "my" ? "is-active" : ""} onClick={() => chooseLanguage("my")} aria-pressed={language === "my"}>မြန်မာ</button>
        </div>
        <a className="status" href="mailto:kgkhant456@gmail.com"><span /> {t.nav.available}</a>
      </div>
    </nav>

    <header className="hero shell" id="top">
      <div className="eyebrow"><span>{t.hero.eyebrow}</span><span>{t.hero.version}</span></div>
      <div className="hero-grid">
        <div><p className="kicker">{t.hero.kicker}</p><h1>{t.hero.titleLead}<em>{t.hero.titleAccent}</em></h1></div>
        <div className="hero-side"><p>{t.hero.body}</p><div className="actions"><Link className="button primary" href="#work">{t.hero.workCta} <span>↘</span></Link><a className="button ghost" href="/k3-cv.html" download>{t.hero.cvCta} <span>↓</span></a></div></div>
      </div>
      <section className="signal-panel" aria-labelledby="process-title">
        <div className="process-heading"><small>{t.hero.processLabel}</small><strong id="process-title">{t.hero.processTitle}</strong></div>
        <ol className="process-flow">
          {t.hero.process.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.title}</strong><p>{step.body}</p></div></li>)}
        </ol>
      </section>
    </header>

    <section className="marquee" aria-label={language === "my" ? "ကျွမ်းကျင်မှုကဏ္ဍများ" : "Disciplines"}><div>{t.hero.disciplines.map((item, index) => <span key={`${item}-${index}`}>{item}{index < t.hero.disciplines.length - 1 && <i />}</span>)}</div></section>

    <section className="freelance-bridge shell" aria-labelledby="freelance-bridge-title">
      <div><span className="bridge-label">{t.freelance.label}</span><h2 id="freelance-bridge-title">{t.freelance.title}</h2></div>
      <div className="bridge-copy"><p>{t.freelance.body}</p><div className="bridge-actions"><Link className="text-link button-link" href="/services">{t.freelance.servicesCta} <span>→</span></Link><Link className="text-link button-link muted-link" href="/websites">{t.freelance.examplesCta} <span>↗</span></Link></div></div>
    </section>

    <section className="section shell" id="work">
      <div className="section-head"><div><span className="index">{t.work.label}</span><h2>{t.work.title}</h2></div><p>{t.work.intro}</p></div>
      <article className="feature-card">
        <div className="feature-copy"><div className="tags"><span>{t.work.flagship}</span><span>{t.work.live}</span></div><h3>Wisp</h3><p className="lede">{t.work.wispLede}</p><p>{t.work.wispBody}</p><div className="metrics"><div><strong>101</strong><small>{t.work.metrics[0]}</small></div><div><strong>70</strong><small>{t.work.metrics[1]}</small></div><div><strong>69.3%</strong><small>{t.work.metrics[2]}</small></div></div><div className="feature-links"><Link className="text-link" href="/case-studies/wisp">{t.work.caseStudy} <span>→</span></Link><a className="text-link" href="https://wispguide.com/" target="_blank" rel="noreferrer">{t.work.liveProduct} <span>↗</span></a></div></div>
        <div className="feature-visual"><WispMotionPreview language={language} /></div>
      </article>

      <div className="case-proof" aria-label={t.work.evidenceLabel}>
        {t.work.proof.map(item => <article key={item.label}><span>{item.label}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}
      </div>

      <div className="project-archive">
        {t.work.projects.map(project => <article key={project.name}>
          <div className="project-meta"><small>{project.type}</small></div>
          <h3>{project.name}</h3><p>{project.line}</p>
          <div className="tool-row">{project.tools.map(tool => <span key={tool}>{tool}</span>)}</div>
          <a className="card-link" href="https://github.com/Kube13" target="_blank" rel="noreferrer">{t.work.viewBuild} <span>↗</span></a>
        </article>)}
      </div>
    </section>

    <section className="section capabilities" id="capabilities"><div className="shell"><div className="section-head"><div><span className="index">{t.capabilities.label}</span><h2>{t.capabilities.title}</h2></div><p>{t.capabilities.intro}</p></div><div className="cap-grid">{t.capabilities.items.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><div className="skills-strip">{skillLabels.map(skill => <span key={skill}>{skill}</span>)}</div></div></section>

    <section className="section shell about-section" id="about">
      <div><span className="index">{t.about.label}</span><h2>{t.about.title}</h2></div>
      <div className="about-copy">{t.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>

    <section className="section experience-section" id="experience"><div className="shell"><div className="section-head"><div><span className="index">{t.experience.label}</span><h2>{t.experience.title}</h2></div><p>{t.experience.intro}</p></div><div className="timeline">{t.experience.items.map(item => <article key={`${item.year}-${item.org}`}><span>{item.year}</span><div><h3>{item.role}</h3><strong>{item.org}</strong><p>{item.detail}</p></div></article>)}</div><div className="education-note"><span>{t.experience.education}</span><strong>{t.experience.degree}</strong><p>{t.experience.educationBody}</p></div><a className="credential-card" href="/datacamp-python-data-associate.pdf" target="_blank" rel="noreferrer"><div><span>{t.experience.credential}</span><h3>{t.experience.certificate}</h3><p>{t.experience.certifiedBy}</p></div><strong>{t.experience.viewCertificate} ↗</strong></a></div></section>

    <section className="section shell" id="demos"><div className="section-head"><div><span className="index">{t.demos.label}</span><h2>{t.demos.title}</h2></div><div className="section-side"><p>{t.demos.intro}</p><Link className="section-route-link" href="/websites">{t.demos.allExamples} <span>→</span></Link></div></div><div className="demo-grid">{t.demos.items.map(demo => <Link className={`demo-card ${demo.accent}`} href={`/demos/${demo.slug}`} key={demo.slug}><div className="demo-top"><span>{t.demos.demoLabel} · {demo.type}</span><b>↗</b></div><div className="demo-canvas"><i/><strong>{demo.name}</strong><small>{t.demos.viewConcept}</small></div><h3>{demo.name}</h3><p>{demo.line}</p><div className="demo-tags">{t.demos.tags.map(tag => <span key={tag}>{tag}</span>)}</div></Link>)}</div></section>

    <section className="section services shell" id="services"><div className="service-intro"><span className="index">{t.services.label}</span><h2>{t.services.title}</h2><p>{t.services.intro}</p><Link className="section-route-link" href="/services">{t.services.viewAll} <span>→</span></Link></div><div className="service-list">{t.services.items.map(service => <div key={service}><span aria-hidden="true">—</span><strong>{service}</strong></div>)}</div></section>

    <section className="contact" id="contact"><div className="shell contact-grid"><div><span className="index">{t.contact.label}</span><h2>{t.contact.title}</h2></div><div><p>{t.contact.body}</p><p className="client-contact-note">{t.contact.clientBody}</p><a className="button light" href="mailto:kgkhant456@gmail.com">{t.contact.email} <span>↗</span></a><a className="contact-link" href="/k3-cv.html" download>{t.contact.cv} <span>↓</span></a><small>KGKHANT456@GMAIL.COM · YANGON / REMOTE</small></div></div></section>
    <footer className="footer shell"><Link className="brand" href="#top"><span>K3</span><i/></Link><p>{t.contact.footerRole}</p><div><a href="https://www.linkedin.com/in/kaung-khant-kyaw-658a4a203/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/Kube13" target="_blank" rel="noreferrer">GitHub</a><a href="mailto:kgkhant456@gmail.com">Email</a><a href="/k3-cv.html" download>CV</a></div><small>© 2026 K3 · Yangon, Myanmar.</small></footer>
  </main>;
}
