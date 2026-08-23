"use client";

import { useEffect, useState } from "react";

export type HeroGlitchStage = "logo" | "blossom" | "button" | "text";
export type HeroGlitchPhase = "stable" | "primary" | "aftershock";
export type BlossomGlitchVariant = "center-flower-tear" | "left-flower-fracture" | "upper-buds-echo" | "right-flower-slice" | "multi-petal-reconstruction";

export const HERO_GLITCH_SLOT_MS = 4000;
export const HERO_GLITCH_LOOP_MS = 16000;
export const DEBUG_BLOSSOM = false;

const stages: HeroGlitchStage[] = ["logo", "blossom", "button", "text"];
const burstDelays = [
  [620, 690, 650, 720],
  [680, 760, 710, 740],
  [600, 680, 640, 700],
  [720, 790, 750, 820],
] as const;
const burstDurations = [240, 450, 320, 280] as const;
const aftershockGaps = [130, 150, 0, 120] as const;
const aftershockDurations = [60, 70, 0, 60] as const;
const blossomVariants: BlossomGlitchVariant[] = ["center-flower-tear", "left-flower-fracture", "upper-buds-echo", "right-flower-slice", "multi-petal-reconstruction"];

type HeroGlitchState = {
  stage: HeroGlitchStage;
  phase: HeroGlitchPhase;
  blossomVariant: BlossomGlitchVariant;
  reducedMotion: boolean;
};

const stableState: HeroGlitchState = {
  stage: "logo",
  phase: "stable",
  blossomVariant: "center-flower-tear",
  reducedMotion: false,
};

export function useHeroGlitch() {
  const [state, setState] = useState<HeroGlitchState>(stableState);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new Set<number>();
    let stageIndex = 0;
    let blossomVariantIndex = 0;
    const stageOccurrences = [0, 0, 0, 0];

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

    if (DEBUG_BLOSSOM) {
      return clearTimers;
    }

    const runStage = () => {
      if (reducedMotionQuery.matches) {
        setState({ ...stableState, reducedMotion: true });
        return;
      }

      const currentIndex = stageIndex;
      const stage = stages[currentIndex];
      const occurrence = stageOccurrences[currentIndex]++;
      const blossomVariant = stage === "blossom"
        ? blossomVariants[blossomVariantIndex++ % blossomVariants.length]
        : blossomVariants[Math.max(0, blossomVariantIndex - 1) % blossomVariants.length];
      const burstDelay = burstDelays[currentIndex][occurrence % burstDelays[currentIndex].length];

      setState({ stage, phase: "stable", blossomVariant, reducedMotion: false });
      schedule(() => setState(current => ({ ...current, phase: "primary" })), burstDelay);
      schedule(() => setState(current => ({ ...current, phase: "stable" })), burstDelay + burstDurations[currentIndex]);

      if (aftershockDurations[currentIndex] > 0) {
        const aftershockStart = burstDelay + burstDurations[currentIndex] + aftershockGaps[currentIndex];
        schedule(() => setState(current => ({ ...current, phase: "aftershock" })), aftershockStart);
        schedule(() => setState(current => ({ ...current, phase: "stable" })), aftershockStart + aftershockDurations[currentIndex]);
      }
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
