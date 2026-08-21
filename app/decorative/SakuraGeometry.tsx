type DecorativeProps = {
  className?: string;
};

function FlowerGlyph({ x = 0, y = 0, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {[0, 72, 144, 216, 288].map(rotation => <polygon
      key={rotation}
      points="0,-8 -4,-15 0,-24 4,-15"
      transform={`rotate(${rotation})`}
      className="sakura-petal-shape"
    />)}
    <circle r="3.1" className="sakura-flower-core" />
  </g>;
}

export function SakuraFlower({ className = "" }: DecorativeProps) {
  return <svg className={`sakura-flower ${className}`} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <g transform="translate(32 32)"><FlowerGlyph /></g>
  </svg>;
}

export function SakuraBranch({ className = "" }: DecorativeProps) {
  return <svg className={`sakura-branch ${className}`} viewBox="0 0 520 240" aria-hidden="true" focusable="false">
    <g className="sakura-branch-lines">
      <path d="M8 208C95 197 123 163 183 150C247 137 306 143 364 91C397 62 426 38 508 29" />
      <path d="M181 150C159 119 139 97 99 86" />
      <path d="M263 135C244 99 247 64 267 28" />
      <path d="M359 94C387 103 419 111 454 100" />
      <path d="M418 49C405 28 402 17 405 6" />
    </g>
    <g className="sakura-branch-nodes"><circle cx="181" cy="150" r="3" /><circle cx="263" cy="135" r="3" /><circle cx="359" cy="94" r="3" /><circle cx="418" cy="49" r="3" /></g>
    <g className="sakura-branch-flowers">
      <FlowerGlyph x={98} y={85} scale={0.62} />
      <FlowerGlyph x={267} y={29} scale={0.78} />
      <FlowerGlyph x={455} y={99} scale={0.56} />
      <FlowerGlyph x={405} y={8} scale={0.46} />
      <FlowerGlyph x={507} y={29} scale={0.72} />
    </g>
  </svg>;
}

function HeroFlowerGlyph({
  x,
  y,
  scale = 1,
  rotation = 0,
  variant = "major",
}: {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  variant?: "major" | "bud";
}) {
  return <g className={`hero-garden-flower hero-garden-flower-${variant}`} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
    {[0, 72, 144, 216, 288].map(petalRotation => <polygon
      key={petalRotation}
      points="0,-7 -7,-17 0,-25 7,-17"
      transform={`rotate(${petalRotation})`}
      className="hero-sakura-petal"
    />)}
    <circle r="3" className="hero-sakura-core" />
  </g>;
}

export function SectionOrnament({ className = "" }: DecorativeProps) {
  return <div className={`section-ornament ${className}`} aria-hidden="true">
    <span /><SakuraFlower /><span />
  </div>;
}

export function GeometricDivider({ className = "" }: DecorativeProps) {
  return <div className={`geometric-divider ${className}`} aria-hidden="true">
    <span /><i /><span />
  </div>;
}

export function HeroGarden() {
  return <div className="hero-garden" aria-label="Abstract geometric sakura garden with a thin K3 signature, mountains and wind lines" role="img">
    <svg className="hero-garden-art" viewBox="0 0 640 600" aria-hidden="true" focusable="false">
      <circle className="hero-garden-disc" cx="338" cy="292" r="227" />

      <g className="hero-garden-wind">
        <path d="M72 214h88c20 0 23 18 6 20h-31" />
        <path d="M92 258h76" />
        <path d="M476 276h88c16 0 19 16 4 17h-29" />
      </g>

      <g className="hero-garden-branch">
        <path className="hero-garden-branch-main" d="M84 384C132 379 160 360 197 332C237 301 257 263 302 242C340 224 376 237 409 214C452 184 463 145 505 130C526 122 542 109 560 94" />
        <path d="M197 332C181 303 170 276 150 257C143 250 137 246 130 241" />
        <path d="M302 242C287 216 279 187 288 155" />
        <path d="M409 214C431 191 440 157 460 126" />
      </g>

      <g className="hero-garden-flowers">
        <HeroFlowerGlyph x={130} y={241} scale={0.84} rotation={-12} />
        <HeroFlowerGlyph x={288} y={155} scale={0.88} rotation={8} />
        <HeroFlowerGlyph x={460} y={126} scale={0.84} rotation={-5} />
        <HeroFlowerGlyph x={560} y={94} scale={0.5} rotation={14} variant="bud" />
      </g>

      <g className="hero-garden-leaves">
        <path d="M226 305l11-14l5 17Z" />
        <path d="M333 228l13-8l-2 15Z" />
        <path d="M428 190l14-9l-3 16Z" />
        <path d="M510 128l11-11l2 15Z" />
      </g>

      <g className="hero-garden-loose-petals">
        <path d="M535 224l5-9l5 9l-5 9Z" />
        <path d="M174 188l4-8l5 7l-4 8Z" />
      </g>

      <g className="hero-garden-mountains">
        <path d="M42 556L144 478l54 49l94-114l80 102l48-54l82 95" />
        <path d="M102 556l82-65l48 44l51-52l68 73" />
        <path d="M42 556h502" />
      </g>

      <g className="hero-garden-signature" transform="translate(472 455) scale(.68)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
    </svg>
  </div>;
}
