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
type PixelGlitchVariant = "upper-tear" | "lower-fragment" | "petal-echo" | "data-loss";
type PixelOffset = { x: number; y: number; color: PixelColor };
type PixelOrientation = 0 | 90 | 180 | 270;
type BlossomKind = "large" | "medium" | "small" | "bud";
type BlossomPixel = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: PixelColor;
  group: string;
  glitchVariant?: PixelGlitchVariant;
  tearVariants: PixelGlitchVariant[];
  hardFracture?: boolean;
};

type FlowerDefinition = {
  x: number;
  y: number;
  group: string;
  kind: BlossomKind;
  pattern: PixelOffset[];
  cellSize: number;
  orientation: PixelOrientation;
};

const HERO_BRANCH_STEP = 6;

const majorFlowerPattern: PixelOffset[] = [
  { x: 0, y: -5, color: "light-lavender" }, { x: -1, y: -4, color: "light-lavender" }, { x: 1, y: -4, color: "light-lavender" },
  { x: -1, y: -3, color: "lavender" }, { x: 0, y: -3, color: "violet" }, { x: 1, y: -3, color: "lavender" },
  { x: 3, y: -3, color: "light-lavender" }, { x: 4, y: -2, color: "light-lavender" }, { x: 3, y: -2, color: "lavender" },
  { x: 3, y: -1, color: "violet" }, { x: 2, y: -1, color: "lavender" },
  { x: 4, y: 1, color: "light-lavender" }, { x: 3, y: 1, color: "lavender" }, { x: 3, y: 2, color: "violet" },
  { x: 2, y: 2, color: "lavender" }, { x: 2, y: 3, color: "light-lavender" }, { x: 1, y: 3, color: "light-lavender" },
  { x: -1, y: 3, color: "light-lavender" }, { x: -2, y: 3, color: "light-lavender" }, { x: -2, y: 2, color: "lavender" },
  { x: -3, y: 2, color: "violet" }, { x: -3, y: 1, color: "lavender" }, { x: -4, y: 1, color: "light-lavender" },
  { x: -4, y: -2, color: "light-lavender" }, { x: -3, y: -3, color: "light-lavender" }, { x: -3, y: -2, color: "lavender" },
  { x: -3, y: -1, color: "violet" }, { x: -2, y: -1, color: "lavender" },
  { x: -1, y: 0, color: "purple" }, { x: 0, y: 0, color: "center" }, { x: 1, y: 0, color: "purple" }, { x: 0, y: 1, color: "soft-pink" },
];

const mediumFlowerPattern: PixelOffset[] = [
  { x: 0, y: -3, color: "light-lavender" }, { x: -1, y: -2, color: "light-lavender" }, { x: 0, y: -2, color: "lavender" }, { x: 1, y: -2, color: "light-lavender" },
  { x: 2, y: -2, color: "light-lavender" }, { x: 2, y: -1, color: "lavender" }, { x: 3, y: -1, color: "light-lavender" },
  { x: 3, y: 1, color: "light-lavender" }, { x: 2, y: 1, color: "lavender" }, { x: 2, y: 2, color: "light-lavender" },
  { x: -2, y: 2, color: "light-lavender" }, { x: -2, y: 1, color: "lavender" }, { x: -3, y: 1, color: "light-lavender" },
  { x: -3, y: -1, color: "light-lavender" }, { x: -2, y: -1, color: "lavender" }, { x: -2, y: -2, color: "light-lavender" },
  { x: -1, y: 0, color: "purple" }, { x: 0, y: 0, color: "center" }, { x: 1, y: 0, color: "purple" },
];

const sideFlowerPattern: PixelOffset[] = [
  { x: -2, y: -2, color: "light-lavender" }, { x: -1, y: -3, color: "light-lavender" }, { x: 0, y: -2, color: "lavender" },
  { x: 1, y: -3, color: "light-lavender" }, { x: 2, y: -2, color: "light-lavender" },
  { x: -3, y: -1, color: "light-lavender" }, { x: -2, y: -1, color: "lavender" }, { x: -1, y: -1, color: "violet" },
  { x: 0, y: -1, color: "soft-pink" }, { x: 1, y: -1, color: "violet" }, { x: 2, y: -1, color: "lavender" }, { x: 3, y: -1, color: "light-lavender" },
  { x: 0, y: 0, color: "center" }, { x: 1, y: 0, color: "purple" }, { x: 1, y: 1, color: "lavender" },
];

const smallFlowerPattern: PixelOffset[] = [
  { x: 0, y: -2, color: "light-lavender" }, { x: -1, y: -1, color: "light-lavender" }, { x: 0, y: -1, color: "lavender" }, { x: 1, y: -1, color: "light-lavender" },
  { x: -2, y: 0, color: "light-lavender" }, { x: -1, y: 0, color: "violet" }, { x: 0, y: 0, color: "center" }, { x: 1, y: 0, color: "violet" },
  { x: 2, y: 0, color: "light-lavender" }, { x: 0, y: 1, color: "soft-pink" },
];

const budPattern: PixelOffset[] = [
  { x: 0, y: -1, color: "light-lavender" }, { x: -1, y: 0, color: "lavender" }, { x: 0, y: 0, color: "center" },
  { x: 1, y: 0, color: "light-lavender" }, { x: 0, y: 1, color: "violet" },
];

const flowerDefinitions: FlowerDefinition[] = [
  { x: 520, y: 108, group: "flower-1", kind: "large", pattern: majorFlowerPattern, cellSize: 8, orientation: 0 },
  { x: 464, y: 76, group: "flower-2", kind: "medium", pattern: mediumFlowerPattern, cellSize: 8, orientation: 90 },
  { x: 318, y: 110, group: "flower-3", kind: "large", pattern: majorFlowerPattern, cellSize: 8, orientation: 270 },
  { x: 272, y: 184, group: "flower-4", kind: "medium", pattern: sideFlowerPattern, cellSize: 8, orientation: 180 },
  { x: 192, y: 248, group: "flower-5", kind: "large", pattern: majorFlowerPattern, cellSize: 8, orientation: 270 },
  { x: 270, y: 440, group: "flower-6", kind: "medium", pattern: mediumFlowerPattern, cellSize: 8, orientation: 180 },
  { x: 536, y: 156, group: "flower-7", kind: "medium", pattern: sideFlowerPattern, cellSize: 8, orientation: 90 },
  { x: 352, y: 312, group: "flower-8", kind: "medium", pattern: mediumFlowerPattern, cellSize: 7, orientation: 0 },
  { x: 232, y: 264, group: "bud-1", kind: "small", pattern: smallFlowerPattern, cellSize: 6, orientation: 90 },
  { x: 304, y: 424, group: "bud-2", kind: "bud", pattern: budPattern, cellSize: 6, orientation: 180 },
  { x: 376, y: 216, group: "bud-3", kind: "small", pattern: smallFlowerPattern, cellSize: 6, orientation: 270 },
  { x: 448, y: 112, group: "bud-4", kind: "bud", pattern: budPattern, cellSize: 6, orientation: 90 },
  { x: 304, y: 248, group: "bud-5", kind: "small", pattern: smallFlowerPattern, cellSize: 6, orientation: 180 },
  { x: 336, y: 408, group: "bud-6", kind: "bud", pattern: budPattern, cellSize: 5, orientation: 270 },
];

const branchRoutes = [
  [[432, 456], [416, 432], [400, 408], [384, 376], [368, 344], [352, 312], [344, 280], [352, 248], [376, 216], [400, 184], [432, 152], [464, 128], [496, 120], [520, 108]],
  [[368, 344], [336, 328], [304, 312], [272, 288], [232, 264], [192, 248]],
  [[400, 408], [368, 400], [336, 408], [304, 424], [270, 440]],
  [[352, 312], [328, 280], [304, 248], [288, 216], [272, 184]],
  [[400, 184], [376, 152], [350, 128], [318, 110]],
  [[432, 152], [448, 112], [464, 76]],
  [[464, 128], [496, 144], [536, 156]],
] as const;

function createBranchPixels() {
  const cells = new Map<string, BlossomPixel>();

  for (const route of branchRoutes) {
    for (let index = 0; index < route.length - 1; index += 1) {
      const [startX, startY] = route[index];
      const [endX, endY] = route[index + 1];
      const steps = Math.max(1, Math.ceil(Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / HERO_BRANCH_STEP));

      for (let step = 0; step <= steps; step += 1) {
        const x = Math.round((startX + (endX - startX) * (step / steps)) / HERO_BRANCH_STEP) * HERO_BRANCH_STEP;
        const y = Math.round((startY + (endY - startY) * (step / steps)) / HERO_BRANCH_STEP) * HERO_BRANCH_STEP;
        cells.set(`${x}-${y}`, { x: x - 3, y: y - 2.25, width: 6.5, height: 4.5, color: "branch", group: "branch", tearVariants: [] });
      }
    }
  }

  return [...cells.values()];
}

const glitchVariants: PixelGlitchVariant[] = ["upper-tear", "lower-fragment", "petal-echo", "data-loss"];
const tearBands: Array<{ variant: PixelGlitchVariant; groups: string[]; row: number }> = [
  { variant: "upper-tear", groups: ["flower-1", "flower-2", "flower-3"], row: -1 },
  { variant: "lower-fragment", groups: ["flower-4", "flower-5", "flower-6"], row: 1 },
  { variant: "petal-echo", groups: ["flower-2", "flower-7", "flower-8"], row: 0 },
  { variant: "data-loss", groups: ["flower-1", "flower-5", "flower-8"], row: -2 },
];

function rotatePixel(pixel: PixelOffset, orientation: PixelOrientation) {
  if (orientation === 90) return { x: -pixel.y, y: pixel.x };
  if (orientation === 180) return { x: -pixel.x, y: -pixel.y };
  if (orientation === 270) return { x: pixel.y, y: -pixel.x };
  return { x: pixel.x, y: pixel.y };
}

function createFlowerPixels() {
  let globalIndex = 0;

  return flowerDefinitions.flatMap(definition => definition.pattern.map(pixel => {
    const rotated = rotatePixel(pixel, definition.orientation);
    const variantSlot = globalIndex % 12;
    const glitchVariant = variantSlot % 3 === 0 ? glitchVariants[variantSlot / 3] : undefined;
    const tearVariants = tearBands
      .filter(band => band.groups.includes(definition.group) && band.row === pixel.y)
      .map(band => band.variant);
    const hardFracture = glitchVariant !== undefined && Math.floor(globalIndex / 12) % 2 === 0;
    globalIndex += 1;

    return {
      x: definition.x + rotated.x * definition.cellSize - definition.cellSize / 2,
      y: definition.y + rotated.y * definition.cellSize - definition.cellSize / 2,
      width: definition.cellSize,
      height: definition.cellSize,
      color: pixel.color,
      group: definition.group,
      glitchVariant,
      tearVariants,
      hardFracture,
    } satisfies BlossomPixel;
  }));
}

const blossomPixels: BlossomPixel[] = [...createBranchPixels(), ...createFlowerPixels()];
const blossomStreaks = [
  { x: 496, y: 94, width: 62, color: "lavender", variant: "upper-tear", origin: "flower-1" },
  { x: 448, y: 70, width: 48, color: "light-lavender", variant: "upper-tear", origin: "flower-2" },
  { x: 302, y: 104, width: 54, color: "violet", variant: "upper-tear", origin: "flower-3" },
  { x: 254, y: 188, width: 58, color: "lavender", variant: "lower-fragment", origin: "flower-4" },
  { x: 170, y: 254, width: 66, color: "light-lavender", variant: "lower-fragment", origin: "flower-5" },
  { x: 248, y: 446, width: 62, color: "violet", variant: "lower-fragment", origin: "flower-6" },
  { x: 452, y: 78, width: 54, color: "soft-pink", variant: "petal-echo", origin: "flower-2" },
  { x: 520, y: 158, width: 58, color: "lavender", variant: "petal-echo", origin: "flower-7" },
  { x: 332, y: 314, width: 52, color: "light-lavender", variant: "petal-echo", origin: "flower-8" },
  { x: 502, y: 116, width: 64, color: "violet", variant: "data-loss", origin: "flower-1" },
  { x: 174, y: 236, width: 54, color: "soft-pink", variant: "data-loss", origin: "flower-5" },
  { x: 334, y: 300, width: 58, color: "lavender", variant: "data-loss", origin: "flower-8" },
] as const;

function PixelBlossom() {
  return <g className="pixel-blossom" shapeRendering="crispEdges">
    <g className="pixel-blossom-cells">
      {blossomPixels.map((pixel, index) => {
        const glitchClass = pixel.glitchVariant ? ` pixel-glitch-${pixel.glitchVariant}` : "";
        const hardFractureClass = pixel.hardFracture ? " pixel-fracture-hard" : "";
        const tearClasses = pixel.tearVariants.map(variant => ` pixel-tear-${variant}`).join("");
        const flowerClass = pixel.group === "branch" ? " pixel-blossom-branch-cell" : " pixel-blossom-flower-cell";
        return <g key={`${pixel.group}-${pixel.x}-${pixel.y}-${index}`}>
          <rect
            className={`pixel-blossom-cell${flowerClass} pixel-color-${pixel.color}${glitchClass}${tearClasses}${hardFractureClass}`}
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
        className={`pixel-blossom-streak pixel-color-${streak.color} pixel-streak-${index + 1} pixel-streak-${streak.variant}`}
        data-streak-origin={streak.origin}
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
  return <div className="hero-garden" aria-label="Asymmetric pixel-art sakura branch with varied blossoms, a thin K3 signature, mountains and wind lines" role="img">
    <svg className="hero-garden-art" viewBox="0 0 640 600" aria-hidden="true" focusable="false">
      <circle className="hero-garden-disc" cx="338" cy="292" r="227" />

      <g className="hero-garden-wind">
        <path d="M72 214h88c20 0 23 18 6 20h-31" />
        <path d="M92 258h76" />
        <path d="M476 276h88c16 0 19 16 4 17h-29" />
      </g>

      <g className="hero-garden-branch">
        <path className="hero-garden-branch-main" d="M432 456C396 400 371 348 352 312C334 277 360 229 400 184C435 145 476 124 520 108" />
        <path d="M368 344C320 321 271 281 192 248" />
        <path d="M400 408C354 397 320 423 270 440" />
        <path d="M352 312C320 277 296 226 272 184" />
        <path d="M400 184C376 151 349 126 318 110" />
        <path d="M432 152C446 116 455 93 464 76" />
        <path d="M464 128C490 137 513 149 536 156" />
      </g>

      <PixelBlossom />

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
