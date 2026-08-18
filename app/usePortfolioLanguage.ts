"use client";

import { useEffect, useState } from "react";
import type { Language } from "./portfolio-copy";

export function usePortfolioLanguage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("k3-portfolio-language");
    const initialLanguage: Language = saved === "my" ? "my" : "en";
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

  return { language, chooseLanguage };
}
