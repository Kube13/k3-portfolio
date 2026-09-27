"use client";

import { useEffect, useRef } from "react";

type Bloom = {
  x: number;
  y: number;
  born: number;
  strength: number;
};

type RailPetal = {
  side: "left" | "right";
  yRatio: number;
  size: number;
  phase: number;
  tilt: number;
};

export default function SiteMotionField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let last = performance.now();
    let musicPlaying = document.documentElement.dataset.musicPlaying === "true";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedMotion.matches;

    const blooms: Bloom[] = [];
    const petals: RailPetal[] = [
      { side: "left", yRatio: 0.27, size: 4.6, phase: 0.3, tilt: -0.55 },
      { side: "left", yRatio: 0.63, size: 3.6, phase: 1.9, tilt: 0.45 },
      { side: "right", yRatio: 0.34, size: 4.1, phase: 2.7, tilt: 0.62 },
      { side: "right", yRatio: 0.72, size: 3.3, phase: 4.1, tilt: -0.38 },
    ];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMusicState = (event: Event) => {
      const detail = (event as CustomEvent<{ playing?: boolean }>).detail;
      musicPlaying = Boolean(detail?.playing);
    };

    const onBloom = (event: Event) => {
      const detail = (event as CustomEvent<{ x?: number; y?: number; kind?: string }>).detail;
      if (typeof detail?.x !== "number" || typeof detail?.y !== "number") return;

      blooms.push({
        x: detail.x,
        y: detail.y,
        born: performance.now(),
        strength: detail.kind === "hover" ? 0.34 : 0.72,
      });

      if (blooms.length > 8) blooms.shift();
    };

    const onReducedMotion = (event: MediaQueryListEvent) => {
      reduced = event.matches;
    };

    const railX = (side: "left" | "right") => {
      const inset = Math.min(34, Math.max(20, width * 0.021));
      return side === "left" ? inset : width - inset;
    };

    const drawRail = (side: "left" | "right", now: number) => {
      const x = railX(side);
      const top = height * 0.12;
      const bottom = height * 0.88;
      const span = bottom - top;
      const time = now * 0.001;
      const direction = side === "left" ? 1 : -1;

      const activeAmplitude = reduced ? 0 : musicPlaying ? 3.1 : 0.65;
      const baseAlpha = musicPlaying ? 0.42 : 0.2;

      const gradient = context.createLinearGradient(0, top, 0, bottom);
      gradient.addColorStop(0, "rgba(75,38,125,0)");
      gradient.addColorStop(0.14, `rgba(75,38,125,${baseAlpha * 0.62})`);
      gradient.addColorStop(0.5, `rgba(183,156,255,${baseAlpha})`);
      gradient.addColorStop(0.86, `rgba(75,38,125,${baseAlpha * 0.62})`);
      gradient.addColorStop(1, "rgba(75,38,125,0)");

      context.save();
      context.strokeStyle = gradient;
      context.lineWidth = 1;
      context.lineCap = "round";
      context.beginPath();

      const steps = 64;
      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps;
        const y = top + span * t;
        const envelope = Math.sin(Math.PI * t);
        const wave =
          Math.sin(t * 5.4 + time * 0.9 + (side === "left" ? 0 : 1.2)) *
          activeAmplitude *
          envelope;

        const px = x + direction * wave;
        if (step === 0) context.moveTo(px, y);
        else context.lineTo(px, y);
      }

      context.stroke();

      const echoOffset = 6 * direction;
      context.globalAlpha = musicPlaying ? 0.5 : 0.28;
      context.lineWidth = 0.55;
      context.beginPath();

      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps;
        const y = top + span * t;
        const envelope = Math.sin(Math.PI * t);
        const wave =
          Math.sin(t * 4.7 + time * 0.64 + 0.9 + (side === "left" ? 0 : 1.5)) *
          activeAmplitude *
          0.46 *
          envelope;

        const px = x + echoOffset + direction * wave;
        if (step === 0) context.moveTo(px, y);
        else context.lineTo(px, y);
      }

      context.stroke();

      if (musicPlaying && !reduced) {
        const travel = (time * 0.12 + (side === "left" ? 0 : 0.42)) % 1;
        const pulseY = top + span * travel;
        const pulseGradient = context.createRadialGradient(x, pulseY, 0, x, pulseY, 8);
        pulseGradient.addColorStop(0, "rgba(255,255,255,.78)");
        pulseGradient.addColorStop(0.42, "rgba(183,156,255,.42)");
        pulseGradient.addColorStop(1, "rgba(183,156,255,0)");

        context.globalAlpha = 1;
        context.fillStyle = pulseGradient;
        context.beginPath();
        context.arc(x, pulseY, 8, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();
    };

    const drawPetal = (petal: RailPetal, now: number) => {
      const time = now * 0.001;
      const baseX = railX(petal.side);
      const direction = petal.side === "left" ? 1 : -1;
      const y = height * petal.yRatio;
      const motion = reduced ? 0 : Math.sin(time * 0.42 + petal.phase) * (musicPlaying ? 3.2 : 1.4);
      const x = baseX + direction * (11 + motion);
      const opacity = musicPlaying ? 0.3 : 0.17;

      context.save();
      context.translate(x, y);
      context.rotate(petal.tilt + Math.sin(time * 0.28 + petal.phase) * 0.08);
      context.beginPath();
      context.ellipse(0, 0, petal.size * 1.55, petal.size * 0.72, 0, 0, Math.PI * 2);
      context.fillStyle = `rgba(255,255,255,${opacity * 0.72})`;
      context.fill();
      context.strokeStyle = `rgba(143,104,216,${opacity})`;
      context.lineWidth = 0.7;
      context.stroke();

      context.beginPath();
      context.moveTo(-petal.size * 0.48, 0);
      context.lineTo(petal.size * 0.52, 0);
      context.strokeStyle = `rgba(75,38,125,${opacity * 0.54})`;
      context.lineWidth = 0.45;
      context.stroke();
      context.restore();
    };

    const drawBlooms = (now: number) => {
      const active = blooms.filter(bloom => now - bloom.born < 650);
      blooms.length = 0;
      blooms.push(...active);

      for (const bloom of active) {
        const age = (now - bloom.born) / 650;
        const alpha = (1 - age) * bloom.strength * 0.22;
        const radius = 8 + age * 34;

        context.save();
        context.strokeStyle = `rgba(183,156,255,${alpha})`;
        context.lineWidth = 0.8;
        context.beginPath();
        context.arc(bloom.x, bloom.y, radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }
    };

    const animate = (now: number) => {
      const delta = Math.min(32, now - last);
      last = now;
      void delta;

      context.clearRect(0, 0, width, height);

      const mobile = width < 768;
      if (!mobile) {
        drawRail("left", now);
        drawRail("right", now);
      }

      const activePetals = mobile ? petals.slice(0, 2) : petals;
      for (const petal of activePetals) {
        drawPetal(petal, now);
      }

      drawBlooms(now);
      frame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("k3:music-state", onMusicState as EventListener);
    window.addEventListener("k3:motion-ripple", onBloom as EventListener);
    reducedMotion.addEventListener("change", onReducedMotion);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("k3:music-state", onMusicState as EventListener);
      window.removeEventListener("k3:motion-ripple", onBloom as EventListener);
      reducedMotion.removeEventListener("change", onReducedMotion);
    };
  }, []);

  return <canvas ref={canvasRef} className="site-motion-field" aria-hidden="true" />;
}
