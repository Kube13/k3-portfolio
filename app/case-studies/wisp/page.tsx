import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "../../site";

export const metadata: Metadata = {
  title: "Wisp Case Study | K3",
  description:
    "A case study on Wisp, a bilingual relationship-pattern product built from structured psychology logic, UX writing, analytics, authentication and deployment.",
  alternates: {
    canonical: "/case-studies/wisp/",
  },
  openGraph: {
    title: "Wisp Case Study | K3",
    description:
      "A case study on Wisp, a bilingual relationship-pattern product built from structured psychology logic, UX writing, analytics, authentication and deployment.",
    url: "/case-studies/wisp/",
    siteName: siteConfig.name,
    type: "article",
    images: [siteConfig.ogImage],
  },
};

const sections=[["01","Problem","Relationship advice is often generic, while clinical language can feel distant. Wisp needed to be useful and personal without pretending to diagnose people."],["02","Product system","A structured test classifies a primary and secondary relationship pattern, then turns answer signals into a guided result and next steps."],["03","Decision logic","Psychological classification stays deterministic. AI is used only for controlled explanation and tone, with approved wording and fallback content."],["04","Built end to end","Bilingual EN/MY results, user flows, analytics, Google authentication, SQLite ownership, paid-session operations, deployment, and cost controls."],["05","Learning","The strongest product work is not a screen—it is the chain connecting user need, logic, wording, operations, measurement, and sustainable cost."]];
export default function WispCaseStudy(){return <main className="case"><nav className="case-nav shell"><Link className="brand" href="/"><span>K3</span><i/></Link><Link href="/#work">← All work</Link></nav><header className="case-hero shell"><span>FLAGSHIP CASE STUDY · 2026</span><h1>Wisp</h1><p>Building a bilingual relationship-pattern product from psychology logic to a measurable, deployable system.</p><div><b>ROLE</b> Product / BA / UX / Systems / Build</div></header><section className="case-metrics"><div className="shell"><article><strong>69.3%</strong><span>TEST COMPLETION</span></article><article><strong>101</strong><span>RECORDED STARTS</span></article><article><strong>70</strong><span>COMPLETIONS</span></article><article><strong>EN / MY</strong><span>LOCALIZED RESULTS</span></article></div></section><section className="case-body shell">{sections.map(([n,t,d])=><article key={n}><span>{n}</span><h2>{t}</h2><p>{d}</p></article>)}</section><section className="case-flow shell"><span>SYSTEM VIEW</span><div><b>USER ANSWERS</b><i>→</i><b>FIXED LOGIC</b><i>→</i><b>SAFE PERSONALIZATION</b><i>→</i><b>RESULT + NEXT STEP</b></div></section><footer className="case-end"><div className="shell"><span>NEXT</span><h2>Want the thinking behind the work?</h2><a href="mailto:hello@yourdomain.me">Start a conversation ↗</a></div></footer></main>}
