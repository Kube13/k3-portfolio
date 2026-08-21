"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Language } from "./portfolio-copy";

export type SiteNavLink = {
  href: string;
  label: string;
};

type SiteNavProps = {
  language: Language;
  chooseLanguage: (language: Language) => void;
  links: SiteNavLink[];
  languageLabel: string;
  navigationLabel: string;
  brandHref?: string;
  availabilityLabel?: string;
};

function NavigationLink({ link, onClick }: { link: SiteNavLink; onClick?: () => void }) {
  if (link.href.startsWith("mailto:")) {
    return <a href={link.href} onClick={onClick}>{link.label}</a>;
  }

  return <Link href={link.href} onClick={onClick}>{link.label}</Link>;
}

export default function SiteNav({
  language,
  chooseLanguage,
  links,
  languageLabel,
  navigationLabel,
  brandHref = "/",
  availabilityLabel,
}: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = `site-nav-menu-${useId().replaceAll(":", "")}`;

  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(true);
    };
    const desktop = window.matchMedia("(min-width: 851px)");
    const onDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktopChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktopChange);
    };
  }, [closeMenu, menuOpen]);

  const openLabel = language === "my" ? "လမ်းညွှန်မီနူး ဖွင့်ရန်" : "Open navigation menu";
  const closeLabel = language === "my" ? "လမ်းညွှန်မီနူး ပိတ်ရန်" : "Close navigation menu";

  return <header className="site-header">
    <nav className="nav site-nav site-header__inner shell" aria-label={navigationLabel}>
      <Link className="brand" href={brandHref} aria-label="K3Labs home"><span>K3LABS</span><i /></Link>

      <div className="navlinks site-nav-desktop-links">
        {links.map(link => <NavigationLink key={`${link.href}-${link.label}`} link={link} />)}
      </div>

      <div className="nav-actions">
        <div className="language-switch" role="group" aria-label={languageLabel}>
          <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => chooseLanguage("en")} aria-pressed={language === "en"}>EN</button>
          <button type="button" className={language === "my" ? "is-active" : ""} onClick={() => chooseLanguage("my")} aria-pressed={language === "my"}>မြန်မာ</button>
        </div>
        {availabilityLabel ? <a className="status" href="mailto:kgkhant456@gmail.com"><span /> {availabilityLabel}</a> : null}
        <button
          ref={menuButtonRef}
          className="site-nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? closeLabel : openLabel}
          onClick={() => setMenuOpen(value => !value)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <List size={20} aria-hidden="true" />}
          <span className="sr-only">{menuOpen ? closeLabel : openLabel}</span>
        </button>
      </div>

      <div className="site-nav-menu" id={menuId} hidden={!menuOpen}>
        {links.map(link => <NavigationLink key={`${link.href}-${link.label}-mobile`} link={link} onClick={() => closeMenu()} />)}
      </div>
    </nav>
  </header>;
}
