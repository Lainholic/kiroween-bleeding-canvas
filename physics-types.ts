/** Payload streamed from the Electron main process (OS-level cursor polling). */
export interface GlobalMouseEvent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isClicked: boolean;
}

/** Fluid palette entries: blood, pumpkin juice, ghost ectoplasm. */
export type FluidKind = 'blood' | 'pumpkin' | 'purple' | 'green';

/** Static fluid node (trail, pool, stain, tail). Rendered through the goo filter and aged. */
export interface BloodNode {
  x: number;
  y: number;
  r: number;
  x2?: number;    // capsule start (streaks and drip tails)
  y2?: number;
  born: number;   // ms timestamp
  life: number;   // seconds until fully evaporated (10.5-15)
  tone: number;   // 0..1 palette variation
  hl: boolean;    // has specular highlight
  kind: FluidKind;
}

/** Gravity drip head with stop-and-go surface tension. */
export interface BloodDrip {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  seed: number;
  friction: number; // load required to break surface tension
  load: number;
  slipping: boolean;
  lastTailY: number;
  born: number;
  kind: FluidKind;
}

/** Airborne splatter droplet or micro-spatter ray. */
export interface BloodParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  frames: number;
  maxFrames: number;
  micro: boolean;
}

export type WeaponKind = 'knife' | 'axe' | 'pumpkin' | 'ghost';

/** Static weapon config. Coordinates live in the 500x500 art frame. */
export interface WeaponDef {
  file: string;            // assets/weapons/<file>, procedural art used if missing
  weight: number;          // spawn probability
  size: number;            // on-screen size of the 500px frame
  anchor: [number, number];          // cutting-edge point (shifted by bury at load) / center
  normal?: [number, number];         // from buried edge toward visible metal
  bury?: number;                     // art px of blade hidden inside the glass
  spin: boolean;
  embed: boolean;
}

/** Live thrown weapon. */
export interface Weapon {
  kind: WeaponKind;
  x0: number; y0: number;  // launch point
  tx: number; ty: number;  // click target
  start: number; dur: number;        // flight 90-130 ms
  s0: number;              // start scale (2.6 or 2.8)
  spins: number;           // total spin (rad) unwound by t = 1
  finalAngle: number;      // locked impact angle
  pinMs: number;           // 6-10 s pinned before slip + fade
  x: number; y: number; angle: number; scale: number; sx: number; sy: number;
  alpha: number; slip: number;
  impacted: boolean; impactAt: number;
}

/** Pre-rendered glass fracture. */
export interface GlassCrack {
  img: HTMLCanvasElement;
  x: number; y: number;
  born: number;
  pinMs: number;
}

/** Continuous drip source at a crack center or blade edge. */
export interface DripEmitter {
  x: number; y: number;
  kind: FluidKind;
  until: number; next: number;
  mMin: number; mMax: number;
}