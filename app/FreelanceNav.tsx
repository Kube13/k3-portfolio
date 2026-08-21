import type { Language } from "./portfolio-copy";
import { freelanceCopy } from "./freelance-copy";
import SiteNav from "./SiteNav";

export default function FreelanceNav({ language, chooseLanguage }: { language: Language; chooseLanguage: (language: Language) => void }) {
  const t = freelanceCopy[language];
  const links = [
    { href: "/", label: t.nav.home },
    { href: "/services", label: t.nav.services },
    { href: "/websites", label: t.nav.websites },
    { href: "/#work", label: t.nav.work },
    { href: "mailto:kgkhant456@gmail.com", label: t.nav.contact },
  ];

  return <div className="subpage-nav">
    <SiteNav
      language={language}
      chooseLanguage={chooseLanguage}
      links={links}
      languageLabel={t.common.languageLabel}
      navigationLabel={language === "my" ? "အဓိက လမ်းညွှန်" : "Primary navigation"}
    />
  </div>;
}
