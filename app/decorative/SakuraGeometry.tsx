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

type PixelColor = "light-lavender" | "lavender" | "violet" | "purple" | "soft-pink" | "center" | "branch";
type PixelGlitchVariant = "a" | "b" | "c" | "d";
type PixelOffset = { x: number; y: number; color: PixelColor };
type BlossomPixel = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: PixelColor;
  group: string;
  glitchVariant?: PixelGlitchVariant;
  detached?: boolean;
};

const HERO_PIXEL_SIZE = 8;

const majorFlowerPattern: PixelOffset[] = [
  { x: -1, y: -3, color: "light-lavender" }, { x: 0, y: -3, color: "light-lavender" }, { x: 1, y: -3, color: "light-lavender" },
  { x: -1, y: -2, color: "lavender" }, { x: 0, y: -2, color: "violet" }, { x: 1, y: -2, color: "lavender" },
  { x: 2, y: -2, color: "light-lavender" }, { x: 2, y: -1, color: "lavender" }, { x: 3, y: -1, color: "light-lavender" }, { x: 1, y: -1, color: "soft-pink" },
  { x: 3, y: 0, color: "light-lavender" }, { x: 2, y: 0, color: "violet" }, { x: 2, y: 1, color: "lavender" }, { x: 3, y: 1, color: "light-lavender" }, { x: 1, y: 1, color: "soft-pink" },
  { x: 1, y: 2, color: "light-lavender" }, { x: 0, y: 2, color: "violet" }, { x: -1, y: 2, color: "lavender" }, { x: 0, y: 3, color: "light-lavender" }, { x: -1, y: 3, color: "light-lavender" },
  { x: -3, y: 1, color: "light-lavender" }, { x: -2, y: 1, color: "lavender" }, { x: -2, y: 0, color: "violet" }, { x: -3, y: -1, color: "light-lavender" }, { x: -2, y: -1, color: "lavender" }, { x: -1, y: -1, color: "soft-pink" },
  { x: -1, y: 0, color: "purple" }, { x: 0, y: 0, color: "center" }, { x: 1, y: 0, color: "purple" },
];

const smallFlowerPattern: PixelOffset[] = majorFlowerPattern.filter((_, index) => index % 2 === 0 || index >= 26);
const budPattern: PixelOffset[] = [
  { x: -1, y: -1, color: "light-lavender" }, { x: 0, y: -1, color: "lavender" }, { x: 1, y: -1, color: "light-lavender" },
  { x: -1, y: 0, color: "violet" }, { x: 0, y: 0, color: "center" }, { x: 1, y: 0, color: "violet" },
  { x: 0, y: 1, color: "soft-pink" }, { x: 1, y: 1, color: "lavender" },
];

const flowerDefinitions = [
  { x: 136, y: 240, group: "flower-1", pattern: majorFlowerPattern },
  { x: 288, y: 152, group: "flower-2", pattern: majorFlowerPattern },
  { x: 464, y: 128, group: "flower-3", pattern: majorFlowerPattern },
  { x: 512, y: 120, group: "flower-4", pattern: smallFlowerPattern },
  { x: 560, y: 96, group: "flower-5", pattern: smallFlowerPattern },
  { x: 232, y: 296, group: "bud-1", pattern: budPattern },
  { x: 448, y: 176, group: "bud-2", pattern: budPattern },
];

const branchRoutes = [
  [[88, 384], [128, 376], [168, 352], [200, 328], [232, 296], [264, 264], [304, 240], [344, 232], [384, 224], [416, 208], [448, 176], [472, 144], [512, 128], [544, 104], [560, 96]],
  [[200, 328], [184, 296], [168, 272], [152, 248], [136, 240]],
  [[304, 240], [288, 208], [288, 176], [288, 152]],
  [[416, 208], [432, 184], [448, 152], [464, 128]],
] as const;

function createBranchPixels() {
  const cells = new Map<string, BlossomPixel>();

  for (const route of branchRoutes) {
    for (let index = 0; index < route.length - 1; index += 1) {
      const [startX, startY] = route[index];
      const [endX, endY] = route[index + 1];
      const steps = Math.max(1, Math.ceil(Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / HERO_PIXEL_SIZE));

      for (let step = 0; step <= steps; step += 1) {
        const x = Math.round((startX + (endX - startX) * (step / steps)) / HERO_PIXEL_SIZE) * HERO_PIXEL_SIZE;
        const y = Math.round((startY + (endY - startY) * (step / steps)) / HERO_PIXEL_SIZE) * HERO_PIXEL_SIZE;
        cells.set(`${x}-${y}`, { x: x - 4, y: y - 3, width: 8, height: 6, color: "branch", group: "branch" });
      }
    }
  }

  return [...cells.values()];
}

const flowerPixels = flowerDefinitions.flatMap(definition => definition.pattern.map(pixel => ({
  x: definition.x + pixel.x * HERO_PIXEL_SIZE - 4,
  y: definition.y + pixel.y * HERO_PIXEL_SIZE - 4,
  width: HERO_PIXEL_SIZE,
  height: HERO_PIXEL_SIZE,
  color: pixel.color,
  group: definition.group,
})));

const loosePixels: BlossomPixel[] = [
  { x: 524, y: 216, width: 8, height: 8, color: "lavender", group: "loose-pixels" },
  { x: 540, y: 232, width: 8, height: 8, color: "soft-pink", group: "loose-pixels" },
  { x: 168, y: 184, width: 8, height: 8, color: "light-lavender", group: "loose-pixels" },
  { x: 184, y: 200, width: 8, height: 8, color: "violet", group: "loose-pixels" },
  { x: 488, y: 80, width: 8, height: 8, color: "light-lavender", group: "loose-pixels" },
  { x: 576, y: 144, width: 8, height: 8, color: "lavender", group: "loose-pixels" },
];

const glitchVariants: PixelGlitchVariant[] = ["a", "b", "c", "d"];
const addressableFlowerPixels: BlossomPixel[] = [...flowerPixels, ...loosePixels].map((pixel, index) => {
  const variantSlot = index % 12;
  const glitchVariant = variantSlot % 3 === 0 ? glitchVariants[variantSlot / 3] : undefined;
  return { ...pixel, glitchVariant, detached: glitchVariant !== undefined && Math.floor(index / 12) % 2 === 0 };
});

const blossomPixels: BlossomPixel[] = [...createBranchPixels(), ...addressableFlowerPixels];
const blossomStreaks = [
  { x: 144, y: 220, width: 52, color: "lavender" },
  { x: 276, y: 136, width: 68, color: "light-lavender" },
  { x: 444, y: 108, width: 76, color: "violet" },
  { x: 504, y: 152, width: 44, color: "branch" },
] as const;

function PixelBlossom() {
  return <g className="pixel-blossom" shapeRendering="crispEdges">
    <g className="pixel-blossom-cells">
      {blossomPixels.map((pixel, index) => {
        const glitchClass = pixel.glitchVariant ? ` pixel-glitch-${pixel.glitchVariant}` : "";
        const detachClass = pixel.detached ? " pixel-detach" : "";
        const flowerClass = pixel.group === "branch" ? " pixel-blossom-branch-cell" : " pixel-blossom-flower-cell";
        return <g key={`${pixel.group}-${pixel.x}-${pixel.y}-${index}`}>
          <rect
            className={`pixel-blossom-cell${flowerClass} pixel-color-${pixel.color}${glitchClass}${detachClass}`}
            data-pixel-group={pixel.group}
            x={pixel.x}
            y={pixel.y}
            width={pixel.width}
            height={pixel.height}
          />
          {pixel.glitchVariant ? <rect
            className={`pixel-blossom-ghost pixel-color-${pixel.color} pixel-glitch-${pixel.glitchVariant}`}
            x={pixel.x}
            y={pixel.y}
            width={pixel.width}
            height={pixel.height}
          /> : null}
        </g>;
      })}
    </g>
    <g className="pixel-blossom-streaks">
      {blossomStreaks.map((streak, index) => <rect
        key={`${streak.x}-${streak.y}`}
        className={`pixel-blossom-streak pixel-color-${streak.color} pixel-streak-${index + 1}`}
        x={streak.x}
        y={streak.y}
        width={streak.width}
        height={index % 2 === 0 ? 4 : 6}
      />)}
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
  return <div className="hero-garden" aria-label="Addressable pixel-grid sakura blossom with a stable branch, thin K3 signature, mountains and wind lines" role="img">
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

      <PixelBlossom />

      <g className="hero-garden-mountains">
        <path d="M42 556L144 478l54 49l94-114l80 102l48-54l82 95" />
        <path d="M102 556l82-65l48 44l51-52l68 73" />
        <path d="M42 556h502" />
      </g>

      <g className="hero-garden-signature" transform="translate(472 455) scale(.68)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
      <g className="hero-garden-signature hero-garden-signature-ghost signature-slice-one" transform="translate(472 455) scale(.68)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
      <g className="hero-garden-signature hero-garden-signature-ghost signature-slice-two" transform="translate(472 455) scale(.68)">
        <path d="M8 8v74M8 46L42 8M8 46l36 36" />
        <path d="M60 14c26-5 43 5 43 20c0 11-8 18-21 21c16 3 25 11 25 24c0 17-18 27-47 23" />
      </g>
    </svg>
  </div>;
}
