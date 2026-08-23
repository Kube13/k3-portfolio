"use client";

import { useEffect, useState } from "react";

export type HeroGlitchStage = "logo" | "blossom" | "button" | "text";
export type BlossomGlitchVariant = "a" | "b" | "c" | "d";

export const HERO_GLITCH_SLOT_MS = 4000;
export const HERO_GLITCH_LOOP_MS = 16000;

const stages: HeroGlitchStage[] = ["logo", "blossom", "button", "text"];
const burstDelays = [480, 660, 540, 720];
const burstDurations = [220, 300, 260, 240];
const blossomVariants: BlossomGlitchVariant[] = ["a", "b", "c", "d"];

type HeroGlitchState = {
  stage: HeroGlitchStage;
  bursting: boolean;
  blossomVariant: BlossomGlitchVariant;
  reducedMotion: boolean;
};

const stableState: HeroGlitchState = {
  stage: "logo",
  bursting: false,
  blossomVariant: "a",
  reducedMotion: false,
};

export function useHeroGlitch() {
  const [state, setState] = useState<HeroGlitchState>(stableState);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new Set<number>();
    let stageIndex = 0;
    let blossomVariantIndex = 0;

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
    };

    const clearTimers = () => {
      timers.forEach(timer => window.clearTimeout(timer));
      timers.clear();
    };

    const runStage = () => {
      if (reducedMotionQuery.matches) {
        setState({ ...stableState, reducedMotion: true });
        return;
      }

      const currentIndex = stageIndex;
      const stage = stages[currentIndex];
      const blossomVariant = stage === "blossom"
        ? blossomVariants[blossomVariantIndex++ % blossomVariants.length]
        : blossomVariants[Math.max(0, blossomVariantIndex - 1) % blossomVariants.length];

      setState({ stage, bursting: false, blossomVariant, reducedMotion: false });
      schedule(() => {
        setState(current => ({ ...current, bursting: true }));
        schedule(() => setState(current => ({ ...current, bursting: false })), burstDurations[currentIndex]);
      }, burstDelays[currentIndex]);
      schedule(() => {
        stageIndex = (stageIndex + 1) % stages.length;
        runStage();
      }, HERO_GLITCH_SLOT_MS);
    };

    const restart = () => {
      clearTimers();
      stageIndex = 0;
      runStage();
    };

    runStage();
    reducedMotionQuery.addEventListener("change", restart);
    return () => {
      reducedMotionQuery.removeEventListener("change", restart);
      clearTimers();
    };
  }, []);

  return state;
}
