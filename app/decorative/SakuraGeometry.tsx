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

function HeroGlassBlossom() {
  const flowers = [
    { x: 150, y: 150, scale: 1.3 },
    { x: 275, y: 92, scale: 1.65 },
    { x: 387, y: 150, scale: 1.15 },
    { x: 454, y: 78, scale: 1.05 },
    { x: 500, y: 134, scale: 1.35 },
  ];

  return <g className="hero-glass-blossom" transform="translate(38 150)">
    <g className="hero-glass-branch">
      <path d="M18 220C86 205 118 181 154 151C197 116 228 113 275 92C328 69 350 113 387 150C423 185 460 154 500 134" />
      <path d="M150 151C125 130 104 116 73 112" />
      <path d="M275 92C286 62 307 42 337 26" />
      <path d="M386 150C420 130 444 100 454 78" />
      <path d="M500 134C520 111 533 88 536 62" />
    </g>

    <g className="hero-glass-buds">
      <rect x="67" y="106" width="8" height="8" />
      <rect x="332" y="21" width="8" height="8" />
      <rect x="531" y="57" width="8" height="8" />
      <rect x="216" y="111" width="6" height="6" />
    </g>

    <g className="hero-glass-flowers">
      {flowers.map((flower, index) => <g key={index} className={`hero-glass-flower hero-glass-flower-${index + 1}`}>
        <FlowerGlyph {...flower} />
      </g>)}
    </g>

    <g className="hero-glass-sparkles">
      <rect x="246" y="38" width="5" height="5" />
      <rect x="431" y="52" width="4" height="4" />
      <rect x="115" y="91" width="4" height="4" />
      <rect x="474" y="178" width="5" height="5" />
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
  return <div className="hero-garden" aria-label="Pixel glass sakura branch with translucent blossoms, attached buds, a thin K3 signature, mountains and wind lines" role="img">
    <svg className="hero-garden-art" viewBox="0 0 640 600" aria-hidden="true" focusable="false">
      <circle className="hero-garden-disc" cx="338" cy="292" r="227" />

      <g className="hero-garden-wind">
        <path d="M72 214h88c20 0 23 18 6 20h-31" />
        <path d="M92 258h76" />
        <path d="M476 276h88c16 0 19 16 4 17h-29" />
      </g>

      <HeroGlassBlossom />

      <g className="hero-garden-mountains">
        <path d="M42 556L144 478l54 49l94-114l80 102l48-54l82 95" />
        <path d="M102 556l82-65l48 44l51-52l68 73" />
        <path d="M42 556h502" />
      </g>

      <g className="hero-garden-signature hero-garden-signature-main" transform="translate(492 470) scale(.62)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
      <g className="hero-garden-signature hero-garden-signature-ghost signature-slice-one" transform="translate(492 470) scale(.62)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
      <g className="hero-garden-signature hero-garden-signature-ghost signature-slice-two" transform="translate(492 470) scale(.62)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
      <g className="hero-garden-signature hero-garden-signature-ghost signature-slice-three" transform="translate(492 470) scale(.62)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
    </svg>
  </div>;
}
