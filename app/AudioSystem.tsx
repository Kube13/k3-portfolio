"use client";

import { Pause, Play, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

const PLAYER_OPEN_KEY = "k3labs-shelter-player-open";
const SFX_ENABLED_KEY = "k3labs-sfx-enabled";
const MUSIC_ENABLED_KEY = "k3labs-music-enabled";
const FIRST_ENTRY_KEY = "k3labs-entry-complete";
const SESSION_FLASH_KEY = "k3labs-session-flash-seen";
const SHELTER_VIDEO_ID = "HQnC1UHBvWA";

type SfxEngine = {
  context: AudioContext;
  master: GainNode;
  toneBus: GainNode;
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
  const toneBus = context.createGain();
  const filter = context.createBiquadFilter();
  const delay = context.createDelay(0.8);
  const feedback = context.createGain();
  const wet = context.createGain();

  master.gain.value = 0.42;
  toneBus.gain.value = 1;

  filter.type = "lowpass";
  filter.frequency.value = 1800;
  filter.Q.value = 0.45;

  delay.delayTime.value = 0.16;
  feedback.gain.value = 0.18;
  wet.gain.value = 0.22;

  toneBus.connect(filter);
  filter.connect(master);

  filter.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(master);

  master.connect(context.destination);

  return { context, master, toneBus };
}

function playTone(engine: SfxEngine, kind: "hover" | "click" | "boot" | "transition") {
  const { context, toneBus } = engine;
  if (context.state !== "running") return;
  const now = context.currentTime;

  const note = (
    frequency: number,
    start: number,
    duration: number,
    gainValue: number,
    type: OscillatorType = "sine",
    detune = 0,
  ) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.detune.value = detune;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.028);
    gain.gain.exponentialRampToValueAtTime(Math.max(gainValue * 0.42, 0.0002), start + duration * 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(toneBus);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  };

  const bloom = (
    root: number,
    start: number,
    duration: number,
    gainValue: number,
  ) => {
    note(root, start, duration, gainValue, "sine", -4);
    note(root * 1.5, start + 0.012, duration * 0.86, gainValue * 0.34, "triangle", 3);
    note(root * 2, start + 0.026, duration * 0.72, gainValue * 0.18, "sine", -2);
  };

  if (kind === "hover") {
    bloom(392, now, 0.18, 0.045);
    return;
  }

  if (kind === "click") {
    bloom(329.63, now, 0.24, 0.075);
    bloom(493.88, now + 0.055, 0.2, 0.032);
    return;
  }

  if (kind === "transition") {
    bloom(293.66, now, 0.3, 0.065);
    bloom(440, now + 0.07, 0.26, 0.045);
    return;
  }

  [261.63, 329.63, 392, 523.25].forEach((frequency, index) => {
    bloom(frequency, now + index * 0.085, 0.34, index === 3 ? 0.045 : 0.06);
  });
}

function getInteractiveTarget(target: Element) {
  return target.closest(
    "a[href], button:not([disabled]), [role='button'], summary, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), label[for], [tabindex]:not([tabindex='-1']), [data-clickable='true']",
  );
}

export default function AudioSystem() {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const sfxRef = useRef<SfxEngine | null>(null);
  const lastHoverRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [entryGate, setEntryGate] = useState(false);
  const [returnFlash, setReturnFlash] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);

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

    const entryComplete = window.localStorage.getItem(FIRST_ENTRY_KEY) === "true";
    const storedSfx = window.localStorage.getItem(SFX_ENABLED_KEY) === "true";
    const storedMusic = window.localStorage.getItem(MUSIC_ENABLED_KEY) === "true";
    const storedPlayerOpen = window.localStorage.getItem(PLAYER_OPEN_KEY) === "true";

    setSfxEnabled(storedSfx);
    setMusicEnabled(storedMusic);
    setPlayerOpen(storedPlayerOpen);

    if (!entryComplete) {
      setEntryGate(true);
      document.documentElement.classList.add("k3-booting");
      return;
    }

    if (window.sessionStorage.getItem(SESSION_FLASH_KEY) !== "true") {
      setReturnFlash(true);
      window.sessionStorage.setItem(SESSION_FLASH_KEY, "true");
      document.documentElement.classList.add("k3-booting");
      const timer = window.setTimeout(() => {
        setReturnFlash(false);
        document.documentElement.classList.remove("k3-booting");
      }, 460);
      return () => {
        window.clearTimeout(timer);
        document.documentElement.classList.remove("k3-booting");
      };
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(SFX_ENABLED_KEY, String(sfxEnabled));
    window.localStorage.setItem(MUSIC_ENABLED_KEY, String(musicEnabled));
    window.localStorage.setItem(PLAYER_OPEN_KEY, String(playerOpen));
  }, [ready, sfxEnabled, musicEnabled, playerOpen]);

  useEffect(() => {
    if (!ready || !sfxEnabled || entryGate) return;

    const onClick = async (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = getInteractiveTarget(target);
      if (!interactive) return;

      try {
        const engine = await ensureSfx();
        const isNavigation = interactive.matches("a[href]") || interactive.getAttribute("role") === "link";
        playTone(engine, isNavigation ? "transition" : "click");
      } catch {}
    };

    const onPointerOver = async (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const interactive = getInteractiveTarget(target);
      if (!interactive) return;

      const from = event.relatedTarget;
      if (from instanceof Node && interactive.contains(from)) return;

      const now = performance.now();
      if (now - lastHoverRef.current < 120) return;
      lastHoverRef.current = now;

      try {
        const engine = await ensureSfx();
        playTone(engine, "hover");
      } catch {}
    };

    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onPointerOver);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onPointerOver);
    };
  }, [ensureSfx, entryGate, ready, sfxEnabled]);

  useEffect(() => () => {
    if (sfxRef.current && sfxRef.current.context.state !== "closed") {
      void sfxRef.current.context.close();
    }
  }, []);

  const finishEntry = async (withSound: boolean) => {
    window.localStorage.setItem(FIRST_ENTRY_KEY, "true");
    window.sessionStorage.setItem(SESSION_FLASH_KEY, "true");

    setSfxEnabled(withSound);
    setEntryGate(false);
    document.documentElement.classList.remove("k3-booting");

    if (withSound) {
      try {
        const engine = await ensureSfx();
        playTone(engine, "boot");
      } catch {}
    }
  };

  const toggleSfx = async () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);

    if (next) {
      try {
        const engine = await ensureSfx();
        playTone(engine, "click");
      } catch {}
    }
  };

  const togglePlayback = async () => {
    const next = !playing;
    setPlaying(next);
    setMusicEnabled(next);
    setPlayerOpen(true);

    if (sfxEnabled) {
      try {
        const engine = await ensureSfx();
        playTone(engine, "click");
      } catch {}
    }

    requestAnimationFrame(() => {
      sendPlayerCommand(playerRef.current, next ? "playVideo" : "pauseVideo");
    });
  };

  if (!ready) return null;

  const origin = encodeURIComponent(window.location.origin);
  const src = `https://www.youtube.com/embed/${SHELTER_VIDEO_ID}?enablejsapi=1&playsinline=1&rel=0&modestbranding=1&origin=${origin}`;

  return (
    <>
      {entryGate ? (
        <div className="k3-entry-screen" role="dialog" aria-modal="true" aria-label="Enter K3Labs">
          <div className="k3-entry-screen__inner">
            <div className="k3-boot-mark"><span>K3LABS</span><i /></div>
            <p>INITIALIZING SYSTEM</p>
            <div className="k3-boot-bar"><i /></div>
            <div className="k3-boot-steps">
              <span>DATA</span>
              <span>SYSTEMS</span>
              <span>HUMAN SIGNAL</span>
              <strong>READY</strong>
            </div>
            <div className="k3-entry-actions">
              <button type="button" data-audio-control onClick={() => void finishEntry(true)}>
                <SpeakerHigh size={16} weight="fill" aria-hidden="true" />
                ENTER WITH SOUND
              </button>
              <button type="button" className="is-quiet" data-audio-control onClick={() => void finishEntry(false)}>
                <SpeakerSlash size={16} aria-hidden="true" />
                ENTER SILENTLY
              </button>
            </div>
            <small>Interface sound only. Shelter stays paused until you choose to play it.</small>
          </div>
        </div>
      ) : null}

      {returnFlash ? (
        <div className="k3-return-flash" aria-hidden="true">
          <span>K3</span><i />
        </div>
      ) : null}

      <div className="sound-dock">
        <div className="audio-preferences" role="group" aria-label="Audio preferences">
          <button
            type="button"
            className={`sfx-toggle ${sfxEnabled ? "is-on" : ""}`}
            data-audio-control
            onClick={() => void toggleSfx()}
            aria-pressed={sfxEnabled}
            title={sfxEnabled ? "Turn interface sounds off" : "Turn interface sounds on"}
          >
            {sfxEnabled ? <SpeakerHigh size={15} weight="fill" aria-hidden="true" /> : <SpeakerSlash size={15} aria-hidden="true" />}
            <span>UI SFX {sfxEnabled ? "ON" : "OFF"}</span>
          </button>
        </div>

        <div className={`shelter-player ${playerOpen ? "is-open" : ""}`}>
          <button
            type="button"
            className="shelter-player__credit"
            data-audio-control
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
          data-audio-control
          onClick={() => void togglePlayback()}
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
