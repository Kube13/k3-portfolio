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

type PixelColor = "light-lavender" | "lavender" | "violet" | "purple" | "soft-pink" | "center" | "branch" | "branch-muted";
type PixelGlitchVariant = "center-flower-tear" | "left-flower-fracture" | "upper-buds-echo" | "right-flower-slice" | "multi-petal-reconstruction";
type PixelOffset = { x: number; y: number; color: PixelColor };
type PixelOrientation = 0 | 90 | 180 | 270;
type BlossomKind = "primary" | "bud" | "branch";
type BlossomPixel = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: PixelColor;
  group: string;
  kind: BlossomKind;
  glitchVariants: PixelGlitchVariant[];
  tearVariants: PixelGlitchVariant[];
  detachedVariants: PixelGlitchVariant[];
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

const HERO_BRANCH_STEP = 7;

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

const budPattern: PixelOffset[] = [
  { x: 0, y: -1, color: "light-lavender" }, { x: -1, y: 0, color: "lavender" }, { x: 0, y: 0, color: "center" },
  { x: 1, y: 0, color: "light-lavender" }, { x: 0, y: 1, color: "violet" },
];

const flowerDefinitions: FlowerDefinition[] = [
  { x: 164, y: 250, group: "flower-left", kind: "primary", pattern: majorFlowerPattern, cellSize: 7.5, orientation: 270 },
  { x: 232, y: 176, group: "flower-upper-left", kind: "primary", pattern: mediumFlowerPattern, cellSize: 6.5, orientation: 90 },
  { x: 420, y: 236, group: "flower-center", kind: "primary", pattern: majorFlowerPattern, cellSize: 9, orientation: 0 },
  { x: 505, y: 286, group: "flower-right", kind: "primary", pattern: majorFlowerPattern, cellSize: 7.5, orientation: 90 },
  { x: 286, y: 145, group: "bud-top", kind: "bud", pattern: budPattern, cellSize: 6, orientation: 0 },
  { x: 272, y: 174, group: "bud-upper-left", kind: "bud", pattern: budPattern, cellSize: 5.5, orientation: 90 },
  { x: 210, y: 320, group: "bud-left-low", kind: "bud", pattern: budPattern, cellSize: 5.5, orientation: 180 },
  { x: 330, y: 350, group: "bud-center-low", kind: "bud", pattern: budPattern, cellSize: 5.5, orientation: 270 },
  { x: 550, y: 174, group: "bud-right-top", kind: "bud", pattern: budPattern, cellSize: 6, orientation: 0 },
  { x: 584, y: 228, group: "bud-right-mid", kind: "bud", pattern: budPattern, cellSize: 5.5, orientation: 90 },
];

const branchRoutes = [
  { group: "branch-main", tapered: true, points: [[558, 440], [552, 412], [540, 384], [525, 356], [505, 335], [482, 318], [455, 304], [425, 292], [390, 299], [355, 315], [320, 307], [285, 288], [250, 274], [220, 268], [185, 260], [164, 250]] },
  { group: "branch-center", points: [[390, 299], [402, 272], [420, 236]] },
  { group: "branch-upper-left", points: [[355, 315], [328, 290], [302, 260], [278, 232], [255, 205], [232, 176]] },
  { group: "branch-top-bud", points: [[278, 232], [278, 202], [283, 172], [286, 145]] },
  { group: "branch-upper-left-bud", points: [[255, 205], [265, 190], [272, 174]] },
  { group: "branch-left-low", points: [[220, 268], [216, 292], [210, 320]] },
  { group: "branch-center-low", points: [[355, 315], [344, 335], [330, 350]] },
  { group: "branch-right-flower", points: [[482, 318], [494, 301], [505, 286]] },
  { group: "branch-right-upright", points: [[525, 356], [538, 320], [546, 280], [548, 228], [550, 174]] },
  { group: "branch-right-mid", points: [[546, 280], [563, 252], [584, 228]] },
] as const;

function createBranchPixels() {
  const cells = new Map<string, BlossomPixel>();

  for (const route of branchRoutes) {
    for (let index = 0; index < route.points.length - 1; index += 1) {
      const [startX, startY] = route.points[index];
      const [endX, endY] = route.points[index + 1];
      const steps = Math.max(1, Math.ceil(Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / HERO_BRANCH_STEP));

      for (let step = 0; step <= steps; step += 1) {
        const x = Math.round((startX + (endX - startX) * (step / steps)) / HERO_BRANCH_STEP) * HERO_BRANCH_STEP;
        const y = Math.round((startY + (endY - startY) * (step / steps)) / HERO_BRANCH_STEP) * HERO_BRANCH_STEP;
        const progress = (index + step / steps) / (route.points.length - 1);
        const addCell = (cellX: number, cellY: number, color: PixelColor) => cells.set(`${cellX}-${cellY}`, {
          x: cellX - 3.75,
          y: cellY - 3.75,
          width: 7.5,
          height: 7.5,
          color,
          group: route.group,
          kind: "branch",
          glitchVariants: [],
          tearVariants: [],
          detachedVariants: [],
        });

        addCell(x, y, "branch");
        if ("tapered" in route && route.tapered && progress < .58) addCell(x - HERO_BRANCH_STEP, y + HERO_BRANCH_STEP, "branch-muted");
        if ("tapered" in route && route.tapered && progress < .18) addCell(x - HERO_BRANCH_STEP * 2, y + HERO_BRANCH_STEP * 2, "branch-muted");
      }
    }
  }

  return [...cells.values()];
}

const glitchSelections: Array<{ variant: PixelGlitchVariant; groups: string[]; modulo: number; offset: number }> = [
  { variant: "center-flower-tear", groups: ["flower-center", "flower-right"], modulo: 4, offset: 0 },
  { variant: "left-flower-fracture", groups: ["flower-left", "flower-upper-left", "bud-left-low"], modulo: 3, offset: 1 },
  { variant: "upper-buds-echo", groups: ["flower-upper-left", "flower-center", "bud-top", "bud-upper-left"], modulo: 4, offset: 2 },
  { variant: "right-flower-slice", groups: ["flower-center", "flower-right", "bud-right-mid"], modulo: 4, offset: 3 },
  { variant: "multi-petal-reconstruction", groups: ["flower-left", "flower-center", "flower-right"], modulo: 6, offset: 4 },
];
const tearBands: Array<{ variant: PixelGlitchVariant; group: string; rows: number[] }> = [
  { variant: "center-flower-tear", group: "flower-center", rows: [-1, 0, 1] },
  { variant: "left-flower-fracture", group: "flower-left", rows: [-1, 1] },
  { variant: "upper-buds-echo", group: "flower-upper-left", rows: [-1, 0] },
  { variant: "right-flower-slice", group: "flower-right", rows: [-1, 0, 1] },
  { variant: "multi-petal-reconstruction", group: "flower-left", rows: [0] },
  { variant: "multi-petal-reconstruction", group: "flower-center", rows: [-2] },
  { variant: "multi-petal-reconstruction", group: "flower-right", rows: [1] },
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
    const glitchVariants = glitchSelections
      .filter(selection => selection.groups.includes(definition.group) && globalIndex % selection.modulo === selection.offset % selection.modulo)
      .map(selection => selection.variant);
    const tearVariants = tearBands
      .filter(band => band.group === definition.group && band.rows.includes(pixel.y))
      .map(band => band.variant);
    const detachedVariants = glitchVariants.filter(variant => {
      const selection = glitchSelections.find(candidate => candidate.variant === variant);
      return selection ? (Math.floor(globalIndex / selection.modulo) + selection.offset) % 3 === 0 : false;
    });
    globalIndex += 1;

    return {
      x: definition.x + rotated.x * definition.cellSize - definition.cellSize / 2,
      y: definition.y + rotated.y * definition.cellSize - definition.cellSize / 2,
      width: definition.cellSize,
      height: definition.cellSize,
      color: pixel.color,
      group: definition.group,
      kind: definition.kind,
      glitchVariants,
      tearVariants,
      detachedVariants,
    } satisfies BlossomPixel;
  }));
}

const blossomPixels: BlossomPixel[] = [...createBranchPixels(), ...createFlowerPixels()];
const blossomStreaks = [
  { x: 388, y: 216, width: 62, height: 5, color: "lavender", variant: "center-flower-tear", origin: "flower-center" },
  { x: 397, y: 236, width: 70, height: 6, color: "light-lavender", variant: "center-flower-tear", origin: "flower-center" },
  { x: 482, y: 278, width: 54, height: 4, color: "violet", variant: "center-flower-tear", origin: "flower-right" },
  { x: 414, y: 254, width: 46, height: 5, color: "soft-pink", variant: "center-flower-tear", origin: "flower-center" },
  { x: 132, y: 238, width: 58, height: 5, color: "lavender", variant: "left-flower-fracture", origin: "flower-left" },
  { x: 148, y: 260, width: 66, height: 5, color: "light-lavender", variant: "left-flower-fracture", origin: "flower-left" },
  { x: 214, y: 168, width: 42, height: 4, color: "violet", variant: "left-flower-fracture", origin: "flower-upper-left" },
  { x: 196, y: 318, width: 36, height: 4, color: "soft-pink", variant: "left-flower-fracture", origin: "bud-left-low" },
  { x: 216, y: 176, width: 44, height: 4, color: "lavender", variant: "upper-buds-echo", origin: "flower-upper-left" },
  { x: 274, y: 143, width: 38, height: 4, color: "light-lavender", variant: "upper-buds-echo", origin: "bud-top" },
  { x: 260, y: 172, width: 34, height: 4, color: "soft-pink", variant: "upper-buds-echo", origin: "bud-upper-left" },
  { x: 398, y: 230, width: 54, height: 4, color: "violet", variant: "upper-buds-echo", origin: "flower-center" },
  { x: 478, y: 274, width: 60, height: 5, color: "light-lavender", variant: "right-flower-slice", origin: "flower-right" },
  { x: 488, y: 294, width: 66, height: 5, color: "lavender", variant: "right-flower-slice", origin: "flower-right" },
  { x: 404, y: 244, width: 52, height: 4, color: "violet", variant: "right-flower-slice", origin: "flower-center" },
  { x: 570, y: 226, width: 40, height: 4, color: "soft-pink", variant: "right-flower-slice", origin: "bud-right-mid" },
  { x: 142, y: 248, width: 50, height: 4, color: "violet", variant: "multi-petal-reconstruction", origin: "flower-left" },
  { x: 392, y: 224, width: 68, height: 5, color: "light-lavender", variant: "multi-petal-reconstruction", origin: "flower-center" },
  { x: 486, y: 286, width: 58, height: 5, color: "lavender", variant: "multi-petal-reconstruction", origin: "flower-right" },
  { x: 334, y: 310, width: 48, height: 4, color: "soft-pink", variant: "multi-petal-reconstruction", origin: "branch-main" },
] as const;

function PixelBlossom() {
  return <g className="pixel-blossom" shapeRendering="crispEdges">
    <g className="pixel-blossom-cells">
      {blossomPixels.map((pixel, index) => {
        const glitchClasses = pixel.glitchVariants.map(variant => ` pixel-glitch-${variant}`).join("");
        const tearClasses = pixel.tearVariants.map(variant => ` pixel-tear-${variant}`).join("");
        const detachedClasses = pixel.detachedVariants.map(variant => ` pixel-detached-${variant}`).join("");
        const flowerClass = pixel.kind === "branch" ? " pixel-blossom-branch-cell" : " pixel-blossom-flower-cell";
        return <g key={`${pixel.group}-${pixel.x}-${pixel.y}-${index}`}>
          <rect
            className={`pixel-blossom-cell${flowerClass} pixel-color-${pixel.color}${glitchClasses}${tearClasses}${detachedClasses}`}
            data-pixel-group={pixel.group}
            data-pixel-kind={pixel.kind}
            x={pixel.x}
            y={pixel.y}
            width={pixel.width}
            height={pixel.height}
          />
          {pixel.glitchVariants.length > 0 ? <rect
            className={`pixel-blossom-ghost pixel-color-${pixel.color}${glitchClasses}`}
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
        height={streak.height}
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
  return <div className="hero-garden" aria-label="Sparse Concept 3 pixel-art sakura branch with four varied blossoms, attached buds, a thin K3 signature, mountains and wind lines" role="img">
    <svg className="hero-garden-art" viewBox="0 0 640 600" aria-hidden="true" focusable="false">
      <circle className="hero-garden-disc" cx="338" cy="292" r="227" />

      <g className="hero-garden-wind">
        <path d="M72 214h88c20 0 23 18 6 20h-31" />
        <path d="M92 258h76" />
        <path d="M476 276h88c16 0 19 16 4 17h-29" />
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
