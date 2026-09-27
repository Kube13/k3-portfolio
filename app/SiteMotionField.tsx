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

    const particleCount = () => {
      const area = Math.max(1, width * height);
      const base = Math.round(area / 42000);
      return Math.max(18, Math.min(reduced ? 18 : 52, base));
    };

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: 0.05 + Math.random() * 0.16,
      size: 1.5 + Math.random() * 4.8,
      phase: Math.random() * Math.PI * 2,
      kind: Math.random() > 0.48 ? "petal" : "pixel",
      alpha: 0.12 + Math.random() * 0.25,
    });

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
      scrollVelocity += (next - scrollY) * 0.018;
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

    const animate = (now: number) => {
      const delta = Math.min(32, now - last) / 16.666;
      last = now;

      context.clearRect(0, 0, width, height);

      const fluidity = reduced ? 0.15 : musicPlaying ? 1.45 : 0.72;
      scrollVelocity *= 0.92;

      const aliveRipples = ripples.filter(ripple => now - ripple.born < 900);
      ripples.length = 0;
      ripples.push(...aliveRipples);

      for (const particle of particles) {
        particle.phase += 0.0065 * delta * fluidity;

        const waveX = Math.sin(particle.phase + particle.y * 0.004) * 0.09 * fluidity;
        const waveY = Math.cos(particle.phase * 0.8 + particle.x * 0.003) * 0.045 * fluidity;

        particle.vx += waveX * 0.012;
        particle.vy += waveY * 0.008;

        particle.vx *= 0.985;
        particle.vy *= 0.995;

        particle.x += (particle.vx + waveX + scrollVelocity * 0.04) * delta;
        particle.y += (particle.vy + Math.abs(scrollVelocity) * 0.018) * delta;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y > height + 26) {
          particle.y = -26;
          particle.x = Math.random() * width;
        }

        let glow = 0;
        for (const ripple of ripples) {
          const age = (now - ripple.born) / 900;
          const dx = particle.x - ripple.x;
          const dy = particle.y - ripple.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const radius = 30 + age * 220;
          const edge = Math.abs(distance - radius);
          if (edge < 70) {
            const force = (1 - edge / 70) * (1 - age) * ripple.strength;
            particle.vx += (dx / Math.max(distance, 1)) * force * 0.025;
            particle.vy += (dy / Math.max(distance, 1)) * force * 0.025;
            glow = Math.max(glow, force * 0.16);
          }
        }

        if (particle.kind === "petal") {
          drawPetal(particle, particle.phase * 0.55 + scrollVelocity * 0.01, glow);
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
