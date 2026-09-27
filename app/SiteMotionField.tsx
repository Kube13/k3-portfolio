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
      const area = Math.max(1, width * height);
      const base = Math.round(area / 42000);
      return Math.max(18, Math.min(reduced ? 18 : 52, base));
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
        kind: Math.random() > 0.48 ? "petal" : "pixel",
        alpha: 0.18 + Math.random() * 0.22,
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
        strength: detail.kind === "hover" ? 0.45 : 1,
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
      const lineInset = Math.min(28, Math.max(16, width * 0.018));
      const meterHeight = Math.min(height * 0.66, 540);
      const startY = (height - meterHeight) / 2;
      const segmentGap = 7;
      const segmentHeight = Math.max(8, meterHeight / meterPhases.length - segmentGap);

      const baseEnergy = musicPlaying ? 1 : 0.12;
      const time = now * 0.001;

      for (let sideIndex = 0; sideIndex < 2; sideIndex += 1) {
        const left = sideIndex === 0;
        const x = left ? lineInset : width - lineInset;

        context.save();
        context.lineCap = "round";

        for (let index = 0; index < meterPhases.length; index += 1) {
          const phase = meterPhases[index];
          const musicalPulse =
            (Math.sin(time * 2.1 + phase) * 0.34 +
              Math.sin(time * 3.7 + phase * 1.31) * 0.22 +
              Math.sin(time * 1.16 + index * 0.53) * 0.18 +
              0.64) *
            baseEnergy;

          const energy = Math.max(0.08, Math.min(1, musicalPulse));
          const y = startY + index * (segmentHeight + segmentGap);
          const widthPulse = 1.4 + energy * (musicPlaying ? 5.2 : 1.8);

          const gradient = context.createLinearGradient(
            left ? x : x - widthPulse,
            y,
            left ? x + widthPulse : x,
            y + segmentHeight,
          );
          gradient.addColorStop(0, `rgba(255,255,255,${0.22 + energy * 0.28})`);
          gradient.addColorStop(0.5, `rgba(183,156,255,${0.2 + energy * 0.36})`);
          gradient.addColorStop(1, `rgba(75,38,125,${0.16 + energy * 0.42})`);

          context.strokeStyle = gradient;
          context.lineWidth = widthPulse;
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x, y + segmentHeight * (0.72 + energy * 0.28));
          context.stroke();

          if (musicPlaying && energy > 0.78) {
            context.fillStyle = `rgba(255,255,255,${0.2 + energy * 0.35})`;
            context.beginPath();
            context.arc(x, y, 1.5 + energy * 1.7, 0, Math.PI * 2);
            context.fill();
          }
        }

        context.restore();
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
        const waveX = Math.sin(particle.phase + particle.y * 0.003) * 0.09 * fluidity;
        const waveY = Math.cos(particle.phase * 0.7 + particle.x * 0.002) * 0.055 * fluidity;
        const edgePull = (edgeTarget - particle.x) * 0.0018;

        particle.vx += edgePull + waveX * 0.01;
        particle.vy += waveY * 0.008;

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
          drawPetal(particle, particle.phase * 0.42, glow);
        } else {
          drawPixel(particle, glow);
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
