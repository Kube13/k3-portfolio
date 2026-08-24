"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type GlitchTrigger = "load" | "viewport" | "interaction";
type GlitchType = "signal" | "data" | "telemetry" | "metric" | "transmission";

type TriggerOptions = {
  trigger: GlitchTrigger;
  duration: number;
  delay?: number;
};

function useGlitchTrigger<T extends HTMLElement>({ trigger, duration, delay = 0 }: TriggerOptions) {
  const targetRef = useRef<T>(null);
  const timerRef = useRef<number | null>(null);
  const hasRunRef = useRef(false);
  const [active, setActive] = useState(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const activate = useCallback(() => {
    if (hasRunRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    hasRunRef.current = true;
    clearTimer();
    setActive(true);
    timerRef.current = window.setTimeout(() => {
      setActive(false);
      timerRef.current = null;
      if (trigger === "interaction") hasRunRef.current = false;
    }, duration);
  }, [clearTimer, duration, trigger]);

  useEffect(() => {
    if (trigger === "interaction") return clearTimer;

    if (trigger === "load") {
      timerRef.current = window.setTimeout(activate, delay);
      return clearTimer;
    }

    const target = targetRef.current;
    if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return clearTimer;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (delay > 0) timerRef.current = window.setTimeout(activate, delay);
      else activate();
    }, { threshold: 0.42 });

    observer.observe(target);
    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [activate, clearTimer, delay, trigger]);

  return { targetRef, active, activate };
}

export function GlitchText({
  children,
  type = "signal",
  trigger = "viewport",
  duration = 240,
  delay = 0,
  corruptText,
  className = "",
}: {
  children: string;
  type?: GlitchType;
  trigger?: GlitchTrigger;
  duration?: number;
  delay?: number;
  corruptText?: string;
  className?: string;
}) {
  const { targetRef, active, activate } = useGlitchTrigger<HTMLSpanElement>({ trigger, duration, delay });

  return <span
    ref={targetRef}
    className={`system-glitch-text system-glitch-${type} ${className}`.trim()}
    data-text={children}
    data-corrupt={corruptText ?? children}
    data-glitch-active={active ? "true" : "false"}
    onPointerEnter={trigger === "interaction" ? activate : undefined}
    onFocus={trigger === "interaction" ? activate : undefined}
  >{children}</span>;
}

export function GlitchGroup({
  children,
  className = "",
  type = "transmission",
  trigger = "viewport",
  duration = 1400,
  delay = 0,
  role,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  type?: GlitchType;
  trigger?: Exclude<GlitchTrigger, "interaction">;
  duration?: number;
  delay?: number;
  role?: string;
  ariaLabel?: string;
}) {
  const { targetRef, active } = useGlitchTrigger<HTMLDivElement>({ trigger, duration, delay });

  return <div
    ref={targetRef}
    className={`system-glitch-group system-glitch-${type} ${className}`.trim()}
    data-glitch-active={active ? "true" : "false"}
    role={role}
    aria-label={ariaLabel}
  >{children}</div>;
}
