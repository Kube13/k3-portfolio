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

export function FallingPetals({ className = "" }: DecorativeProps) {
  return <div className={`falling-petals ${className}`} aria-hidden="true">
    {Array.from({ length: 6 }, (_, index) => <span key={index}><svg viewBox="0 0 18 28"><path d="M9 1C15 7 17 15 9 27C1 15 3 7 9 1Z" /></svg></span>)}
  </div>;
}

export function WindLines({ className = "" }: DecorativeProps) {
  return <svg className={`wind-lines ${className}`} viewBox="0 0 420 110" aria-hidden="true" focusable="false">
    <path d="M4 22H173c24 0 25 24 3 24h-31" />
    <path d="M54 65h232c28 0 30-27 2-27h-40" />
    <path d="M164 89h246" />
    <circle cx="38" cy="65" r="2.5" />
    <circle cx="392" cy="89" r="2.5" />
  </svg>;
}

export function MountainLines({ className = "" }: DecorativeProps) {
  return <svg className={`mountain-lines ${className}`} viewBox="0 0 640 240" aria-hidden="true" focusable="false">
    <path d="M2 225L104 126l45 44 94-132 83 111 43-48 70 80 45-47 154 91" />
    <path d="M2 225h636" />
    <path d="M88 225l124-111 58 61 41-38 88 88" />
  </svg>;
}

export function CircleMotif({ className = "" }: DecorativeProps) {
  return <svg className={`circle-motif ${className}`} viewBox="0 0 500 500" aria-hidden="true" focusable="false">
    <circle cx="250" cy="250" r="214" className="circle-motif-fill" />
    <circle cx="250" cy="250" r="184" className="circle-motif-line circle-motif-line-one" />
    <circle cx="250" cy="250" r="132" className="circle-motif-line circle-motif-line-two" />
    <path d="M53 250h64M383 250h64M250 53v64M250 383v64" className="circle-motif-ticks" />
    <circle cx="117" cy="250" r="4" className="circle-motif-node" />
    <circle cx="383" cy="250" r="4" className="circle-motif-node" />
  </svg>;
}

export function GeometricGrid({ className = "" }: DecorativeProps) {
  return <svg className={`geometric-grid ${className}`} viewBox="0 0 420 420" aria-hidden="true" focusable="false">
    {[70, 140, 210, 280, 350].map(position => <g key={position}>
      <path d={`M${position} 0v420`} />
      <path d={`M0 ${position}h420`} />
    </g>)}
    <circle cx="140" cy="140" r="3" /><circle cx="280" cy="210" r="3" /><circle cx="210" cy="350" r="3" />
  </svg>;
}

export function K3Monogram({ className = "" }: DecorativeProps) {
  return <svg className={`k3-monogram ${className}`} viewBox="0 0 320 300" aria-hidden="true" focusable="false">
    <path d="M34 28h42v96l72-96h51l-91 119 84 125h-54l-62-94v94H34Z" className="k3-mark-fill" />
    <path d="M213 61c45-3 76 18 76 54c0 23-14 40-37 47c28 7 44 27 44 53c0 39-31 62-84 57" className="k3-mark-three" />
    <path d="M24 18h276M24 282h276" className="k3-mark-guide" />
    <circle cx="300" cy="18" r="4" /><circle cx="300" cy="282" r="4" />
  </svg>;
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
  return <div className="hero-garden" aria-label="Abstract geometric garden built from a K3 monogram, sakura branch, mountains and wind lines" role="img">
    <GeometricGrid className="hero-garden-grid" />
    <CircleMotif className="hero-garden-circle" />
    <MountainLines className="hero-garden-mountains" />
    <WindLines className="hero-garden-wind" />
    <K3Monogram className="hero-garden-mark" />
    <SakuraBranch className="hero-garden-branch" />
    <FallingPetals />
  </div>;
}
