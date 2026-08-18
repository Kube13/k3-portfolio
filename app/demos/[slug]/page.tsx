import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "../../site";
const concepts={cafe:{label:"CAFÉ CONCEPT",name:"Northstar Coffee",strap:"Good coffee. A slower morning.",detail:"Small-batch coffee, honest food, and a quiet corner in the middle of the city.",action:"View the menu",tone:"cafe",nav:["Menu","Our story","Visit"],cards:["Cloud Latte","Citrus Tonic","Morning Plate"]},restaurant:{label:"RESTAURANT CONCEPT",name:"Serein Table",strap:"A season, served slowly.",detail:"A contemporary dining room shaped by local produce, fire, and time.",action:"Reserve a table",tone:"restaurant",nav:["Menu","Story","Reservations"],cards:["Tasting Menu","À La Carte","Wine & Pairing"]},"law-firm":{label:"LEGAL SERVICES CONCEPT",name:"Aster & Rowe",strap:"Clear counsel for consequential decisions.",detail:"Practical legal guidance for businesses, families, and individuals navigating change.",action:"Book a consultation",tone:"law",nav:["Expertise","People","Insights"],cards:["Business Advisory","Property","Dispute Resolution"]},shop:{label:"LOCAL RETAIL CONCEPT",name:"Field Supply",strap:"Useful things, chosen well.",detail:"Everyday objects, durable materials, and considered goods for work and home.",action:"Browse products",tone:"shop",nav:["New","Objects","Visit"],cards:["Carry","Workspace","Home"]}} as const;
export function generateStaticParams(){return Object.keys(concepts).map(slug=>({slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}): Promise<Metadata> {
  const { slug } = await params;
  const c = concepts[slug as keyof typeof concepts];
  if (!c) return {};
  const title = `${c.name} Concept Demo | K3`;
  const description = `${c.name} is a concept website demo for ${c.label.toLowerCase().replace(" concept", "")} clients, showing responsive structure, honest demo labeling and business-ready content sections.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/demos/${slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `/demos/${slug}/`,
      siteName: siteConfig.name,
      type: "website",
      images: [siteConfig.ogImage],
    },
  };
}

export default async function Demo({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const c=concepts[slug as keyof typeof concepts];if(!c)notFound();return <main className={`concept ${c.tone}`}><div className="concept-note">CONCEPT / DEMO · MOCK CONTENT <Link href="/websites">← Return to website examples</Link></div><nav className="concept-nav"><strong>{c.name}</strong><div>{c.nav.map(x=><a href="#details" key={x}>{x}</a>)}</div><a className="concept-action" href="#contact">{c.action}</a></nav><header className="concept-hero"><span>{c.label}</span><h1>{c.strap}</h1><p>{c.detail}</p><a href="#details">{c.action} ↘</a><div className="concept-art"><b>{c.name.charAt(0)}</b></div></header><section className="concept-details" id="details"><span>SELECTED / 01—03</span><h2>Made to feel specific,<br/>built to stay flexible.</h2><div className="concept-cards">{c.cards.map((x,i)=><article key={x}><small>0{i+1}</small><div className="card-art"><b>{x.charAt(0)}</b></div><h3>{x}</h3><p>Thoughtful details and clear information, ready to replace with the real business content.</p></article>)}</div></section><section className="concept-contact" id="contact"><p>OPENING HOURS · LOCATION · CONTACT</p><h2>Come and find us.</h2><a href="mailto:hello@yourbusiness.com">hello@yourbusiness.com ↗</a></section></main>}
