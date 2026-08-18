"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Language } from "./portfolio-copy";

const SLIDE_DURATION = 4200;

const motionCopy = {
  en: {
    region: "How Wisp turns answers into personalized guidance",
    heading: "WISP / PRODUCT MOTION",
    summary: "23 QUESTIONS · 2 LANGUAGES",
    previous: "Previous Wisp preview",
    next: "Next Wisp preview",
    choose: "Choose animation state",
    manual: "MANUAL CONTROLS",
    loop: "AUTO LOOP · PAUSES ON HOVER",
    details: "Key details",
    slides: [
      { id: "input", label: "Structured responses captured", eyebrow: "INPUT · 23 RESPONSES", title: "Structured responses captured.", copy: "Wisp collects 23 answers about connection, conflict, trust, closeness, and emotional safety. The assessment works in both English and Burmese.", tags: ["CONNECTION", "CONFLICT", "TRUST", "EN / MY"] },
      { id: "logic", label: "Relationship patterns identified", eyebrow: "LOGIC · STRUCTURED RULES", title: "Relationship patterns identified.", copy: "Structured psychology rules compare the answers to identify the user’s main pattern, secondary tendencies, triggers, and emotional needs.", tags: ["MAIN PATTERN", "SECONDARY TENDENCIES", "TRIGGERS"] },
      { id: "output", label: "Personalized guidance generated", eyebrow: "OUTPUT · CLEAR GUIDANCE", title: "Personalized guidance generated.", copy: "Wisp turns the identified patterns into clear, safe guidance covering dating behavior, relationship dynamics, recurring loops, and healthier next steps.", tags: ["DATING", "RELATIONSHIP DYNAMICS", "NEXT STEPS"] },
    ],
  },
  my: {
    region: "Wisp က အဖြေတွေကို ကိုယ်ပိုင်လမ်းညွှန်ချက်အဖြစ် ပြောင်းလဲပုံ",
    heading: "WISP / PRODUCT လုပ်ဆောင်ပုံ",
    summary: "မေးခွန်း 23 ခု · ဘာသာစကား 2 မျိုး",
    previous: "Wisp ရဲ့ အရင်အဆင့်ကို ကြည့်ရန်",
    next: "Wisp ရဲ့ နောက်အဆင့်ကို ကြည့်ရန်",
    choose: "လုပ်ဆောင်ပုံအဆင့်ကို ရွေးချယ်ရန်",
    manual: "ကိုယ်တိုင် ထိန်းချုပ်ရန်",
    loop: "အလိုအလျောက် ပြန်လည်ပြသသည် · HOVER လုပ်လျှင် ခေတ္တရပ်မည်",
    details: "အဓိကအချက်များ",
    slides: [
      { id: "input", label: "စနစ်တကျ အဖြေများ စုဆောင်းခြင်း", eyebrow: "INPUT · အဖြေ 23 ခု", title: "စနစ်တကျ အဖြေများကို စုဆောင်းပါတယ်။", copy: "Wisp က connection၊ conflict၊ trust၊ closeness နဲ့ emotional safety ဆိုင်ရာ အဖြေ 23 ခုကို စုဆောင်းပါတယ်။ Assessment ကို English နဲ့ မြန်မာ နှစ်ဘာသာစလုံးနဲ့ အသုံးပြုနိုင်ပါတယ်။", tags: ["CONNECTION", "CONFLICT", "TRUST", "EN / MY"] },
      { id: "logic", label: "Relationship pattern များ ရှာဖွေခြင်း", eyebrow: "LOGIC · သတ်မှတ်ထားသော စည်းမျဉ်းများ", title: "Relationship pattern တွေကို ရှာဖွေသတ်မှတ်ပါတယ်။", copy: "စနစ်တကျ တည်ဆောက်ထားတဲ့ psychology rules တွေက အဖြေတွေကို နှိုင်းယှဉ်ပြီး user ရဲ့ main pattern၊ secondary tendency၊ trigger နဲ့ emotional need တွေကို ရှာဖွေပါတယ်။", tags: ["MAIN PATTERN", "SECONDARY TENDENCIES", "TRIGGERS"] },
      { id: "output", label: "ကိုယ်ပိုင်လမ်းညွှန်ချက် ထုတ်ပေးခြင်း", eyebrow: "OUTPUT · ရှင်းလင်းသော လမ်းညွှန်ချက်", title: "ကိုယ်ပိုင်လမ်းညွှန်ချက်ကို ထုတ်ပေးပါတယ်။", copy: "Wisp က ရှာဖွေထားတဲ့ pattern တွေကို dating behavior၊ relationship dynamics၊ ထပ်တလဲလဲဖြစ်နေတဲ့ loop နဲ့ ပိုကျန်းမာတဲ့ နောက်တစ်ဆင့်တွေအကြောင်း ရှင်းလင်းပြီး လုံခြုံတဲ့ လမ်းညွှန်ချက်အဖြစ် ပြောင်းလဲပေးပါတယ်။", tags: ["DATING", "RELATIONSHIP DYNAMICS", "NEXT STEPS"] },
    ],
  },
} as const;

type ExplanationSlideProps = {
  eyebrow: string;
  title: string;
  copy: string;
  tags: readonly string[];
  detailsLabel: string;
};

function ExplanationSlide({ eyebrow, title, copy, tags, detailsLabel }: ExplanationSlideProps) {
  return <article className="explanation-panel">
    <span className="explanation-eyebrow">{eyebrow}</span>
    <h4>{title}</h4>
    <p>{copy}</p>
    <div className="explanation-tags" aria-label={detailsLabel}>
      {tags.map((tag) => <span key={tag}>{tag}</span>)}
    </div>
  </article>;
}

export default function WispMotionPreview({ language }: { language: Language }) {
  const t = motionCopy[language];
  const slides = t.slides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
      setCycle((current) => current + 1);
    }, SLIDE_DURATION);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, cycle, slides.length]);

  const move = (direction: -1 | 1) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
    setCycle((current) => current + 1);
  };

  const choose = (index: number) => {
    setActive(index);
    setCycle((current) => current + 1);
  };

  return <div
    className="wisp-motion"
    role="region"
    aria-roledescription="carousel"
    aria-label={t.region}
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)}
    onBlurCapture={() => setPaused(false)}
  >
    <div className="motion-head"><span>{t.heading}</span><span>{t.summary}</span></div>

    <button className="motion-arrow motion-arrow-left" type="button" onClick={() => move(-1)} aria-label={t.previous}>
      <ArrowLeft size={19} weight="regular" aria-hidden="true" />
    </button>
    <button className="motion-arrow motion-arrow-right" type="button" onClick={() => move(1)} aria-label={t.next}>
      <ArrowRight size={19} weight="regular" aria-hidden="true" />
    </button>

    <div className="motion-stage">
      <div className="motion-state" aria-live="polite">{slides[active].label}</div>
      <div className={`motion-slide motion-slide-${slides[active].id}`} key={`${slides[active].id}-${cycle}`}>
        <ExplanationSlide {...slides[active]} detailsLabel={t.details} />
      </div>
    </div>

    <div className="motion-controls">
      <div className="motion-progress" aria-label={t.choose}>
        {slides.map((slide, index) => <button
          type="button"
          key={slide.id}
          className={index === active ? "is-active" : ""}
          onClick={() => choose(index)}
          aria-label={language === "my" ? `${slide.label} ကိုပြရန်` : `Show ${slide.label}`}
          aria-current={index === active ? "step" : undefined}
        ><span key={`${slide.id}-${cycle}`} /></button>)}
      </div>
      <small>{reducedMotion ? t.manual : t.loop}</small>
    </div>
  </div>;
}
