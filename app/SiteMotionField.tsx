"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  kind: "pixel" | "petal";
  alpha: number;
  side: "left" | "right";
};

type Ripple = {
  x: number;
  y: number;
  born: number;
  strength: number;
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
    let scrollY = window.scrollY;
    let scrollVelocity = 0;
    let musicPlaying = document.documentElement.dataset.musicPlaying === "true";
    let sfxEnabled = document.documentElement.dataset.sfxEnabled === "true";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedMotion.matches;

    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    const meterPhases = Array.from({ length: 18 }, (_, index) => index * 0.47 + Math.random() * 1.8);

    const particleCount = () => {
      return reduced ? 2 : 7;
    };

    const createParticle = (): Particle => {
      const side = Math.random() > 0.5 ? "right" : "left";
      const edgeBand = Math.min(150, Math.max(72, width * 0.12));
      return {
        x: side === "left"
          ? Math.random() * edgeBand
          : width - Math.random() * edgeBand,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: 0.07 + Math.random() * 0.16,
        size: 2 + Math.random() * 5.2,
        phase: Math.random() * Math.PI * 2,
        kind: "petal",
        alpha: 0.08 + Math.random() * 0.12,
        side,
      };
    };

    const syncParticles = () => {
      const wanted = particleCount();
      while (particles.length < wanted) particles.push(createParticle());
      while (particles.length > wanted) particles.pop();
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      syncParticles();
    };

    const onScroll = () => {
      const next = window.scrollY;
      scrollVelocity += (next - scrollY) * 0.004;
      scrollY = next;
    };

    const onMusicState = (event: Event) => {
      const detail = (event as CustomEvent<{ playing?: boolean }>).detail;
      musicPlaying = Boolean(detail?.playing);
    };

    const onSfxState = (event: Event) => {
      const detail = (event as CustomEvent<{ enabled?: boolean }>).detail;
      sfxEnabled = Boolean(detail?.enabled);
    };

    const onRipple = (event: Event) => {
      const detail = (event as CustomEvent<{ x?: number; y?: number; kind?: string }>).detail;
      if (typeof detail?.x !== "number" || typeof detail?.y !== "number") return;
      ripples.push({
        x: detail.x,
        y: detail.y,
        born: performance.now(),
        strength: detail.kind === "hover" ? 0.32 : 0.75,
      });
      if (ripples.length > 10) ripples.shift();
    };

    const onReducedMotion = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      syncParticles();
    };

    const drawPetal = (particle: Particle, angle: number, glow: number) => {
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(angle);
      context.beginPath();
      context.ellipse(0, 0, particle.size * 1.45, particle.size * 0.68, 0, 0, Math.PI * 2);
      context.fillStyle = `rgba(145, 111, 191, ${particle.alpha + glow})`;
      context.fill();
      context.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.36, particle.alpha + 0.08 + glow)})`;
      context.lineWidth = 0.55;
      context.stroke();
      context.restore();
    };

    const drawPixel = (particle: Particle, glow: number) => {
      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(Math.sin(particle.phase) * 0.18);
      const s = particle.size;
      context.fillStyle = `rgba(112, 84, 158, ${particle.alpha + glow})`;
      context.fillRect(-s / 2, -s / 2, s, s);
      context.strokeStyle = `rgba(255,255,255,${Math.min(0.28, particle.alpha + 0.06 + glow)})`;
      context.lineWidth = 0.5;
      context.strokeRect(-s / 2, -s / 2, s, s);
      context.restore();
    };

    const drawMusicMeters = (now: number) => {
      const inset = Math.min(30, Math.max(18, width * 0.02));
      const top = height * 0.16;
      const bottom = height * 0.84;
      const span = bottom - top;
      const time = now * 0.001;
      const energy = musicPlaying ? 1 : 0.16;

      for (let sideIndex = 0; sideIndex < 2; sideIndex += 1) {
        const left = sideIndex === 0;
        const baseX = left ? inset : width - inset;

        for (let lineIndex = 0; lineIndex < 3; lineIndex += 1) {
          const offset = (lineIndex - 1) * 5;
          const phase = time * (0.72 + lineIndex * 0.11) + sideIndex * 1.4;
          const amplitude = (1.2 + lineIndex * 0.9) * energy;

          context.beginPath();

          const steps = 42;
          for (let step = 0; step <= steps; step += 1) {
            const t = step / steps;
            const y = top + span * t;
            const wave =
              Math.sin(t * 7.2 + phase) * amplitude +
              Math.sin(t * 13.4 - phase * 0.7) * amplitude * 0.28;

            const x = baseX + (left ? 1 : -1) * (offset + wave);

            if (step === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          }

          const alpha = musicPlaying
            ? 0.34 - lineIndex * 0.06
            : 0.12 - lineIndex * 0.02;

          context.strokeStyle =
            lineIndex === 1
              ? `rgba(183,156,255,${alpha})`
              : `rgba(75,38,125,${alpha})`;

          context.lineWidth = lineIndex === 1 ? 1.15 : 0.7;
          context.lineCap = "round";
          context.stroke();
        }

        if (musicPlaying) {
          const pulseY = top + span * (0.5 + Math.sin(time * 0.58 + sideIndex) * 0.18);
          context.fillStyle = "rgba(255,255,255,.52)";
          context.beginPath();
          context.arc(baseX, pulseY, 1.45, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    const animate = (now: number) => {
      const delta = Math.min(32, now - last) / 16.666;
      last = now;

      context.clearRect(0, 0, width, height);

      const fluidity = reduced ? 0.18 : musicPlaying ? 1.18 : 0.68;
      scrollVelocity *= 0.86;

      drawMusicMeters(now);

      const aliveRipples = ripples.filter(ripple => now - ripple.born < 900);
      ripples.length = 0;
      ripples.push(...aliveRipples);

      for (const particle of particles) {
        particle.phase += 0.0042 * delta * fluidity;

        const edgeBand = Math.min(160, Math.max(76, width * 0.13));
        const edgeTarget = particle.side === "left" ? edgeBand * 0.44 : width - edgeBand * 0.44;
        const waveX = Math.sin(particle.phase + particle.y * 0.003) * 0.035 * fluidity;
        const waveY = Math.cos(particle.phase * 0.7 + particle.x * 0.002) * 0.02 * fluidity;
        const edgePull = (edgeTarget - particle.x) * 0.0018;

        particle.vx += edgePull + waveX * 0.006;
        particle.vy += waveY * 0.004;

        particle.vx *= 0.985;
        particle.vy *= 0.996;

        particle.x += (particle.vx + waveX + scrollVelocity * 0.012) * delta;
        particle.y += (particle.vy + Math.abs(scrollVelocity) * 0.004) * delta;

        const innerLimit = particle.side === "left" ? edgeBand * 1.12 : width - edgeBand * 1.12;
        if (particle.side === "left" && particle.x > innerLimit) particle.vx -= 0.06;
        if (particle.side === "right" && particle.x < innerLimit) particle.vx += 0.06;

        if (particle.x < -24 || particle.x > width + 24) {
          particle.side = Math.random() > 0.5 ? "right" : "left";
          particle.x = particle.side === "left" ? edgeBand * 0.35 : width - edgeBand * 0.35;
        }
        if (particle.y > height + 26) {
          particle.y = -26;
          particle.x = particle.side === "left"
            ? Math.random() * edgeBand
            : width - Math.random() * edgeBand;
        }

        let glow = 0;
        for (const ripple of ripples) {
          const age = (now - ripple.born) / 900;
          const dx = particle.x - ripple.x;
          const dy = particle.y - ripple.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const radius = 18 + age * 145;
          const edge = Math.abs(distance - radius);
          if (edge < 46) {
            const force = (1 - edge / 46) * (1 - age) * ripple.strength;
            particle.vx += (dx / Math.max(distance, 1)) * force * 0.012;
            particle.vy += (dy / Math.max(distance, 1)) * force * 0.012;
            glow = Math.max(glow, force * 0.12);
          }
        }

        if (particle.kind === "petal") {
          drawPetal(particle, particle.phase * 0.28, glow);
        }
      }

      frame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("k3:music-state", onMusicState as EventListener);
    window.addEventListener("k3:sfx-state", onSfxState as EventListener);
    window.addEventListener("k3:motion-ripple", onRipple as EventListener);
    reducedMotion.addEventListener("change", onReducedMotion);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("k3:music-state", onMusicState as EventListener);
      window.removeEventListener("k3:sfx-state", onSfxState as EventListener);
      window.removeEventListener("k3:motion-ripple", onRipple as EventListener);
      reducedMotion.removeEventListener("change", onReducedMotion);
    };
  }, []);

  return <canvas ref={canvasRef} className="site-motion-field" aria-hidden="true" />;
}
