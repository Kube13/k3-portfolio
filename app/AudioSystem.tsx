"use client";

import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "k3labs-sound-enabled";

type AudioGraph = {
  context: AudioContext;
  master: GainNode;
  ambient: GainNode;
  oscillators: OscillatorNode[];
};

function createAudioGraph(): AudioGraph {
  const context = new AudioContext();
  const master = context.createGain();
  const ambient = context.createGain();
  const filter = context.createBiquadFilter();

  master.gain.value = 0.22;
  ambient.gain.value = 0.0001;
  filter.type = "lowpass";
  filter.frequency.value = 520;
  filter.Q.value = 0.8;

  ambient.connect(filter);
  filter.connect(master);
  master.connect(context.destination);

  const oscillators = [55, 82.5].map((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 0 ? 0.032 : 0.012;

    oscillator.connect(gain);
    gain.connect(ambient);
    oscillator.start();

    return oscillator;
  });

  ambient.gain.exponentialRampToValueAtTime(0.075, context.currentTime + 1.8);

  return { context, master, ambient, oscillators };
}

function playUiTone(graph: AudioGraph, kind: "click" | "hover") {
  const { context, master } = graph;
  if (context.state !== "running") return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = kind === "click" ? "triangle" : "sine";
  oscillator.frequency.setValueAtTime(kind === "click" ? 430 : 610, now);
  oscillator.frequency.exponentialRampToValueAtTime(kind === "click" ? 260 : 540, now + 0.06);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(kind === "click" ? 0.045 : 0.018, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "click" ? 0.09 : 0.055));

  oscillator.connect(gain);
  gain.connect(master);
  oscillator.start(now);
  oscillator.stop(now + 0.11);
}

export default function AudioSystem() {
  const graphRef = useRef<AudioGraph | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  const stopAudio = useCallback(() => {
    const graph = graphRef.current;
    if (!graph) return;

    const now = graph.context.currentTime;
    graph.ambient.gain.cancelScheduledValues(now);
    graph.ambient.gain.setValueAtTime(Math.max(graph.ambient.gain.value, 0.0001), now);
    graph.ambient.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    window.setTimeout(() => {
      graph.oscillators.forEach(oscillator => {
        try { oscillator.stop(); } catch {}
      });
      void graph.context.close();
      if (graphRef.current === graph) graphRef.current = null;
    }, 260);
  }, []);

  const startAudio = useCallback(async () => {
    if (!graphRef.current || graphRef.current.context.state === "closed") {
      graphRef.current = createAudioGraph();
    }

    if (graphRef.current.context.state === "suspended") {
      await graphRef.current.context.resume();
    }
  }, []);

  useEffect(() => {
    setReady(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    window.localStorage.setItem(STORAGE_KEY, String(enabled));

    if (!enabled) {
      stopAudio();
      return;
    }

    const unlock = () => {
      void startAudio();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };

    void startAudio().catch(() => {
      window.addEventListener("pointerdown", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });
    });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [enabled, ready, startAudio, stopAudio]);

  useEffect(() => {
    if (!enabled) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("a, button, [role='button']")) return;
      if (target.closest("[data-sound-toggle]")) return;
      if (graphRef.current) playUiTone(graphRef.current, "click");
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest(".selected-project, .feature-card, .homepage-demo-card, .text-link, .card-link");
      if (!interactive) return;

      const from = event.relatedTarget;
      if (from instanceof Node && interactive.contains(from)) return;
      if (graphRef.current) playUiTone(graphRef.current, "hover");
    };

    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onPointerOver);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onPointerOver);
    };
  }, [enabled]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const toggle = async () => {
    const next = !enabled;
    setEnabled(next);

    if (next) {
      try {
        await startAudio();
        if (graphRef.current) playUiTone(graphRef.current, "click");
      } catch {
        // A later user gesture will retry through the unlock listeners.
      }
    }
  };

  if (!ready) return null;

  return (
    <button
      type="button"
      className={`sound-toggle ${enabled ? "is-on" : "is-off"}`}
      data-sound-toggle
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute K3Labs sound" : "Enable K3Labs sound"}
      title={enabled ? "Sound on" : "Sound off"}
    >
      <span className="sound-toggle__icon" aria-hidden="true">
        {enabled ? <SpeakerHigh size={16} weight="fill" /> : <SpeakerSlash size={16} />}
      </span>
      <span className="sound-toggle__label">{enabled ? "SOUND ON" : "SOUND OFF"}</span>
      <span className="sound-toggle__meter" aria-hidden="true"><i /><i /><i /></span>
    </button>
  );
}
