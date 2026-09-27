"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "k3labs-shelter-player-open";
const SESSION_BOOT_KEY = "k3labs-boot-seen";
const SHELTER_VIDEO_ID = "HQnC1UHBvWA";

type SfxEngine = {
  context: AudioContext;
  master: GainNode;
};

function sendPlayerCommand(iframe: HTMLIFrameElement | null, command: "playVideo" | "pauseVideo") {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: "command", func: command, args: [] }),
    "https://www.youtube.com",
  );
}

function createSfxEngine(): SfxEngine {
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0.34;
  master.connect(context.destination);
  return { context, master };
}

function playTone(engine: SfxEngine, kind: "hover" | "click" | "boot" | "transition") {
  const { context, master } = engine;
  if (context.state !== "running") return;
  const now = context.currentTime;

  const makeNote = (frequency: number, start: number, duration: number, gainValue: number, type: OscillatorType = "sine") => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  };

  if (kind === "hover") {
    makeNote(720, now, 0.045, 0.05, "sine");
    return;
  }

  if (kind === "click") {
    makeNote(420, now, 0.07, 0.085, "triangle");
    makeNote(620, now + 0.035, 0.055, 0.045, "sine");
    return;
  }

  if (kind === "transition") {
    makeNote(360, now, 0.11, 0.07, "triangle");
    makeNote(520, now + 0.045, 0.12, 0.055, "sine");
    return;
  }

  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    makeNote(frequency, now + index * 0.085, 0.16, 0.09, "sine");
  });
}

export default function AudioSystem() {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const sfxRef = useRef<SfxEngine | null>(null);
  const lastHoverRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [booting, setBooting] = useState(false);

  const ensureSfx = useCallback(async () => {
    if (!sfxRef.current || sfxRef.current.context.state === "closed") {
      sfxRef.current = createSfxEngine();
    }
    if (sfxRef.current.context.state === "suspended") {
      await sfxRef.current.context.resume();
    }
    return sfxRef.current;
  }, []);

  useEffect(() => {
    setReady(true);
    setPlayerOpen(window.localStorage.getItem(STORAGE_KEY) === "true");

    if (window.sessionStorage.getItem(SESSION_BOOT_KEY) !== "true") {
      setBooting(true);
      window.sessionStorage.setItem(SESSION_BOOT_KEY, "true");
      document.documentElement.classList.add("k3-booting");

      const timer = window.setTimeout(() => {
        setBooting(false);
        document.documentElement.classList.remove("k3-booting");
      }, 1900);

      return () => {
        window.clearTimeout(timer);
        document.documentElement.classList.remove("k3-booting");
      };
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, String(playerOpen));
  }, [playerOpen, ready]);

  useEffect(() => {
    if (!ready) return;

    let bootChimePlayed = false;

    const unlock = async () => {
      try {
        const engine = await ensureSfx();
        if (!bootChimePlayed) {
          playTone(engine, "boot");
          bootChimePlayed = true;
        }
      } catch {}
    };

    const onClick = async (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("a, button, [role='button']")) return;
      if (target.closest("[data-sound-toggle]")) return;

      try {
        const engine = await ensureSfx();
        playTone(engine, target.closest("a[href]") ? "transition" : "click");
      } catch {}
    };

    const onPointerOver = async (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const interactive = target.closest(
        ".selected-project, .feature-card, .homepage-demo-card, .text-link, .card-link, .button, .navlinks a, .language-switch button",
      );
      if (!interactive) return;

      const from = event.relatedTarget;
      if (from instanceof Node && interactive.contains(from)) return;

      const now = performance.now();
      if (now - lastHoverRef.current < 90) return;
      lastHoverRef.current = now;

      try {
        const engine = await ensureSfx();
        playTone(engine, "hover");
      } catch {}
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onPointerOver);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onPointerOver);
    };
  }, [ensureSfx, ready]);

  useEffect(() => () => {
    if (sfxRef.current && sfxRef.current.context.state !== "closed") {
      void sfxRef.current.context.close();
    }
  }, []);

  const togglePlayback = async () => {
    const next = !playing;
    setPlaying(next);
    setPlayerOpen(true);

    try {
      const engine = await ensureSfx();
      playTone(engine, "click");
    } catch {}

    requestAnimationFrame(() => {
      sendPlayerCommand(playerRef.current, next ? "playVideo" : "pauseVideo");
    });
  };

  if (!ready) return null;

  const origin = encodeURIComponent(window.location.origin);
  const src = `https://www.youtube.com/embed/${SHELTER_VIDEO_ID}?enablejsapi=1&playsinline=1&rel=0&modestbranding=1&origin=${origin}`;

  return (
    <>
      {booting ? (
        <div className="k3-boot-screen" role="status" aria-live="polite" aria-label="K3Labs loading">
          <div className="k3-boot-screen__inner">
            <div className="k3-boot-mark"><span>K3</span><i /></div>
            <p>INITIALIZING SYSTEM</p>
            <div className="k3-boot-bar"><i /></div>
            <div className="k3-boot-steps">
              <span>DATA</span>
              <span>SYSTEMS</span>
              <span>HUMAN SIGNAL</span>
              <strong>READY</strong>
            </div>
          </div>
        </div>
      ) : null}

      <div className="sound-dock">
        <div className={`shelter-player ${playerOpen ? "is-open" : ""}`}>
          <button
            type="button"
            className="shelter-player__credit"
            onClick={() => setPlayerOpen(value => !value)}
            aria-expanded={playerOpen}
          >
            <span>SOUNDTRACK</span>
            <strong>Porter Robinson + Madeon — Shelter</strong>
            <small>{playerOpen ? "Hide player" : "Official stream · View credit"}</small>
          </button>

          {playerOpen ? (
            <div className="shelter-player__panel">
              <p>
                Shoutout to Porter Robinson and Madeon for making something this beautiful — music that makes digital worlds feel human.
              </p>
              <div className="shelter-player__frame">
                <iframe
                  ref={playerRef}
                  src={src}
                  title="Porter Robinson and Madeon — Shelter"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className={`sound-toggle ${playing ? "is-on" : "is-off"}`}
          data-sound-toggle
          onClick={togglePlayback}
          aria-pressed={playing}
          aria-label={playing ? "Pause Shelter by Porter Robinson and Madeon" : "Play Shelter by Porter Robinson and Madeon"}
          title={playing ? "Pause Shelter" : "Play Shelter"}
        >
          <span className="sound-toggle__icon" aria-hidden="true">
            {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
          </span>
          <span className="sound-toggle__label">{playing ? "PAUSE SHELTER" : "PLAY SHELTER"}</span>
          <span className="sound-toggle__meter" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>
    </>
  );
}
