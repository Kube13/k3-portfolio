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

const CONCEPT3_BLOSSOM_ASSET = "/k3_concept3_blossom_transparent.png";

function Concept3Blossom() {
  const imageProps = {
    href: CONCEPT3_BLOSSOM_ASSET,
    width: 534,
    height: 283,
    preserveAspectRatio: "xMidYMid meet",
  } as const;

  return <g className="concept3-blossom" data-blossom-source={CONCEPT3_BLOSSOM_ASSET} transform="translate(53 156) scale(.98)">
    <image className="concept3-blossom-image concept3-blossom-base" data-blossom-layer="base" {...imageProps} />
    <image className="concept3-blossom-image concept3-blossom-glitch concept3-blossom-ghost" data-blossom-layer="lavender-ghost" {...imageProps} />
    <image className="concept3-blossom-image concept3-blossom-glitch concept3-blossom-tear-a" data-blossom-layer="horizontal-tear-a" {...imageProps} />
    <image className="concept3-blossom-image concept3-blossom-glitch concept3-blossom-tear-b" data-blossom-layer="horizontal-tear-b" {...imageProps} />
    <image className="concept3-blossom-image concept3-blossom-glitch concept3-blossom-streak concept3-blossom-streak-a" data-blossom-layer="data-streak-a" {...imageProps} />
    <image className="concept3-blossom-image concept3-blossom-glitch concept3-blossom-streak concept3-blossom-streak-b" data-blossom-layer="data-streak-b" {...imageProps} />
    <image className="concept3-blossom-image concept3-blossom-glitch concept3-blossom-streak concept3-blossom-streak-c" data-blossom-layer="data-streak-c" {...imageProps} />
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
  return <div className="hero-garden" aria-label="Exact Concept 3 pixel-art sakura branch with four blossoms, attached buds, a thin K3 signature, mountains and wind lines" role="img">
    <svg className="hero-garden-art" viewBox="0 0 640 600" aria-hidden="true" focusable="false">
      <circle className="hero-garden-disc" cx="338" cy="292" r="227" />

      <g className="hero-garden-wind">
        <path d="M72 214h88c20 0 23 18 6 20h-31" />
        <path d="M92 258h76" />
        <path d="M476 276h88c16 0 19 16 4 17h-29" />
      </g>

      <Concept3Blossom />

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
