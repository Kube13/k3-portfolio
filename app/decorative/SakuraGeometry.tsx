type DecorativeProps = {
  className?: string;
};

function FlowerGlyph({ x = 0, y = 0, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {[0, 72, 144, 216, 288].map(rotation => <g key={rotation} transform={`rotate(${rotation})`}>
      <polygon
        points="0,-8 -4,-15 0,-24 4,-15"
        className="sakura-petal-shape"
      />
      <path
        d="M-1.8 -16.2L0 -21L1.7 -17.3"
        className="sakura-petal-glint"
      />
    </g>)}
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

function HeroGlassFlower({
  x,
  y,
  scale = 1,
  className = "",
}: {
  x: number;
  y: number;
  scale?: number;
  className?: string;
}) {
  return <g className={`hero-glass-flower ${className}`} transform={`translate(${x} ${y}) scale(${scale})`}>
    {[0, 72, 144, 216, 288].map(rotation => <g key={rotation} transform={`rotate(${rotation})`}>
      <polygon
        points="0,-7 -6,-14 -5,-21 0,-27 5,-21 6,-14"
        fill="url(#heroPetalGlass)"
        stroke="url(#heroPetalEdge)"
        strokeWidth="1.35"
        strokeLinejoin="miter"
        style={{ filter: "drop-shadow(0 5px 9px rgba(75,38,125,.16))" }}
      />
      <path
        d="M-2.5 -17L0 -23L2.2 -18.5"
        fill="none"
        stroke="rgba(255,255,255,.9)"
        strokeWidth="1.1"
        strokeLinecap="square"
        opacity=".82"
      />
    </g>)}
    <rect
      x="-3.5"
      y="-3.5"
      width="7"
      height="7"
      fill="rgba(248,245,255,.35)"
      stroke="rgba(183,156,255,.9)"
      strokeWidth="1"
      style={{ filter: "drop-shadow(0 0 6px rgba(183,156,255,.38))" }}
    />
  </g>;
}

function HeroGlassBlossom() {
  return <g className="hero-glass-blossom">
    <defs>
      <linearGradient id="heroPetalGlass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity=".34" />
        <stop offset="48%" stopColor="#eee8fa" stopOpacity=".13" />
        <stop offset="100%" stopColor="#b79cff" stopOpacity=".11" />
      </linearGradient>
      <linearGradient id="heroPetalEdge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity=".95" />
        <stop offset="55%" stopColor="#d8c5ff" stopOpacity=".92" />
        <stop offset="100%" stopColor="#8f68d8" stopOpacity=".78" />
      </linearGradient>
    </defs>

    <g className="hero-glass-branch">
      <path d="M92 405C160 373 205 331 252 286C301 240 346 221 403 203C447 189 490 157 535 112" />
      <path d="M254 285C232 251 213 229 181 212" />
      <path d="M402 203C392 168 397 140 414 116" />
      <path d="M478 168C501 176 524 176 550 165" />
    </g>

    <HeroGlassFlower x={185} y={212} scale={1.25} className="hero-glass-flower-1" />
    <HeroGlassFlower x={404} y={116} scale={1.52} className="hero-glass-flower-2" />
    <HeroGlassFlower x={551} y={165} scale={1.06} className="hero-glass-flower-3" />

    <g className="hero-glass-buds">
      <rect x="246" y="278" width="7" height="7" />
      <rect x="472" y="162" width="6" height="6" />
      <rect x="527" y="111" width="7" height="7" />
    </g>
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
  return <div className="hero-garden" aria-label="Minimal pixel-glass sakura branch with three translucent blossoms and a K3 signature" role="img">
    <svg className="hero-garden-art" viewBox="0 0 640 560" aria-hidden="true" focusable="false">
      <circle className="hero-garden-disc" cx="380" cy="270" r="188" />
      <HeroGlassBlossom />

      <g className="hero-garden-signature hero-garden-signature-main" transform="translate(486 414) scale(.58)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
      <g className="hero-garden-signature hero-garden-signature-ghost signature-slice-one" transform="translate(486 414) scale(.58)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
      <g className="hero-garden-signature hero-garden-signature-ghost signature-slice-two" transform="translate(486 414) scale(.58)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
      <g className="hero-garden-signature hero-garden-signature-ghost signature-slice-three" transform="translate(486 414) scale(.58)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
    </svg>
  </div>;
}
