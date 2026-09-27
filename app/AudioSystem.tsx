"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "k3labs-shelter-player-open";
const SHELTER_VIDEO_ID = "HQnC1UHBvWA";

function sendPlayerCommand(iframe: HTMLIFrameElement | null, command: "playVideo" | "pauseVideo") {
  if (!iframe?.contentWindow) return;

  iframe.contentWindow.postMessage(
    JSON.stringify({
      event: "command",
      func: command,
      args: [],
    }),
    "https://www.youtube.com",
  );
}

export default function AudioSystem() {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);

  useEffect(() => {
    setReady(true);
    setPlayerOpen(window.localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, String(playerOpen));
  }, [playerOpen, ready]);

  const togglePlayback = () => {
    const next = !playing;
    setPlaying(next);
    setPlayerOpen(true);

    requestAnimationFrame(() => {
      sendPlayerCommand(playerRef.current, next ? "playVideo" : "pauseVideo");
    });
  };

  if (!ready) return null;

  const origin = typeof window === "undefined" ? "" : encodeURIComponent(window.location.origin);
  const src = `https://www.youtube.com/embed/${SHELTER_VIDEO_ID}?enablejsapi=1&playsinline=1&rel=0&modestbranding=1&origin=${origin}`;

  return (
    <div className="sound-dock">
      <div className={`shelter-player ${playerOpen ? "is-open" : ""}`}>
        <div className="shelter-player__credit">
          <span>NOW PLAYING</span>
          <strong>Porter Robinson + Madeon — Shelter</strong>
          <small>
            Shoutout to Porter Robinson and Madeon for making something this beautiful — music that makes digital worlds feel human.
          </small>
        </div>

        {playerOpen ? (
          <div className="shelter-player__frame">
            <iframe
              ref={playerRef}
              src={src}
              title="Porter Robinson and Madeon — Shelter (Official Audio)"
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
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
  );
}
