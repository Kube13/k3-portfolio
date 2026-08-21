const previewCopy = {
  cafe: { name: "Northstar Coffee", label: "CAFÉ / HOSPITALITY", headline: "A slower morning.", cta: "VIEW MENU" },
  restaurant: { name: "Serein Table", label: "DINING / RESERVATIONS", headline: "A season, served slowly.", cta: "RESERVE" },
  "law-firm": { name: "Aster & Rowe", label: "PROFESSIONAL SERVICES", headline: "Clear counsel.", cta: "CONSULTATION" },
  shop: { name: "Field Supply", label: "LOCAL RETAIL", headline: "Useful things, chosen well.", cta: "BROWSE" },
} as const;

export type WebsitePreviewSlug = keyof typeof previewCopy;

export default function WebsitePreview({ slug }: { slug: WebsitePreviewSlug }) {
  const preview = previewCopy[slug];

  return <div className={`site-preview preview-${slug}`} aria-hidden="true">
    <div className="site-preview-chrome"><span /><span /><span /><i>k3 / concept demo</i></div>
    <div className="site-preview-page">
      <div className="site-preview-nav"><strong>{preview.name}</strong><span>ABOUT&nbsp;&nbsp; WORK&nbsp;&nbsp; CONTACT</span></div>
      <div className="site-preview-hero">
        <div><small>{preview.label}</small><b>{preview.headline}</b><em>{preview.cta} ↘</em></div>
        <i><span>{preview.name.charAt(0)}</span></i>
      </div>
      <div className="site-preview-lines"><span /><span /><span /></div>
    </div>
  </div>;
}
