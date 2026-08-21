"use client";

import Link from "next/link";
import type { Language } from "./portfolio-copy";
import { freelanceCopy } from "./freelance-copy";

export default function FreelanceNav({ language, chooseLanguage }: { language: Language; chooseLanguage: (language: Language) => void }) {
  const t = freelanceCopy[language];
  return <nav className="nav subpage-nav shell" aria-label={language === "my" ? "အဓိက လမ်းညွှန်" : "Primary navigation"}>
    <Link className="brand" href="/" aria-label="K3Labs home"><span>K3LABS</span><i /></Link>
    <div className="navlinks"><Link href="/">{t.nav.home}</Link><Link href="/services">{t.nav.services}</Link><Link href="/websites">{t.nav.websites}</Link><Link href="/#work">{t.nav.work}</Link><a href="mailto:kgkhant456@gmail.com">{t.nav.contact}</a></div>
    <div className="nav-actions">
      <div className="language-switch" role="group" aria-label={t.common.languageLabel}>
        <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => chooseLanguage("en")} aria-pressed={language === "en"}>EN</button>
        <button type="button" className={language === "my" ? "is-active" : ""} onClick={() => chooseLanguage("my")} aria-pressed={language === "my"}>မြန်မာ</button>
      </div>
    </div>
  </nav>;
}
