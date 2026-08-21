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

function HeroFlowerGlyph({ x, y, scale = 1, rotation = 0 }: { x: number; y: number; scale?: number; rotation?: number }) {
  return <g className="hero-garden-flower" transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
    {[0, 72, 144, 216, 288].map(petalRotation => <polygon
      key={petalRotation}
      points="0,-7 -5,-14 0,-23 5,-14"
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
      <circle className="hero-garden-disc" cx="338" cy="292" r="225" />

      <g className="hero-garden-wind">
        <path d="M58 208h126c22 0 24 20 4 20h-34" />
        <path d="M88 252h88" />
        <path d="M474 286h104c18 0 20 18 2 18h-28" />
      </g>

      <g className="hero-garden-branch">
        <path className="hero-garden-branch-main" d="M96 345C154 338 195 299 257 282C339 260 389 211 454 177C498 154 532 138 568 128" />
        <path d="M176 311C161 280 142 255 113 238" />
        <path d="M257 282C240 248 227 222 218 202" />
        <path d="M386 213C373 180 370 148 373 119" />
        <path d="M487 160C501 138 513 117 518 96" />
      </g>

      <g className="hero-garden-nodes">
        <circle cx="176" cy="311" r="3" />
        <circle cx="257" cy="282" r="3" />
        <circle cx="386" cy="213" r="3" />
        <circle cx="487" cy="160" r="3" />
      </g>

      <g className="hero-garden-flowers">
        <HeroFlowerGlyph x={113} y={238} scale={0.72} rotation={-8} />
        <HeroFlowerGlyph x={218} y={202} scale={0.9} rotation={7} />
        <HeroFlowerGlyph x={373} y={119} scale={0.82} rotation={-4} />
        <HeroFlowerGlyph x={518} y={96} scale={0.68} rotation={11} />
      </g>

      <g className="hero-garden-leaves">
        <path d="M291 260l11-15l5 17Z" />
        <path d="M421 194l14-8l-3 16Z" />
        <path d="M535 140l12-12l2 16Z" />
        <path d="M329 175l7-11l5 12Z" />
      </g>

      <g className="hero-garden-loose-petals">
        <path d="M552 217l5-9l5 9l-5 9Z" />
        <path d="M466 260l4-8l5 7l-4 8Z" />
        <path d="M150 181l4-8l5 7l-4 8Z" />
      </g>

      <g className="hero-garden-mountains">
        <path d="M42 556L144 478l54 49l94-114l80 102l48-54l82 95" />
        <path d="M102 556l82-65l48 44l51-52l68 73" />
        <path d="M42 556h502" />
      </g>

      <g className="hero-garden-signature" transform="translate(406 435)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
        <path className="hero-garden-signature-guide" d="M0 96h116" />
        <circle cx="116" cy="96" r="2.5" />
      </g>
    </svg>
  </div>;
}
