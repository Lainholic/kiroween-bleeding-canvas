# Requirements Document

## Introduction

Bleeding Canvas (Costume Contest Track).
- **Concept**: A Windows global transparent desktop overlay (Electron). Visceral 3D-looking blood follows the cursor across the whole OS (desktop, Explorer, browsers) while every click, drag and keystroke passes through to the apps underneath. Every global click throws a Kiroween weapon that shatters the "monitor glass".
- **Track**: Kiroween 2026 - Costume Contest.

## Glossary

- **Overlay**: the transparent, click-through Electron window.
- **Node**: a static fluid circle that ages and is merged by the goo filter.
- **Drip**: a moving fluid head that leaves tail nodes.
- **Embed**: clipping a blade along a fault line so it appears inside the glass.

## Requirements

### R1. Global Click-Through Overlay
1. The app **SHALL** create a frameless, transparent, always-on-top (`screen-saver` level), taskbar-hidden, shadowless, non-focusable window covering the primary display.
2. The window **SHALL** call `setIgnoreMouseEvents(true, { forward: true })` so input passes through and focus is never stolen.
3. **WHILE** running, the main process **SHALL** poll `screen.getCursorScreenPoint()` at ~60Hz and read left/right button state from user32 `GetAsyncKeyState` (persistent PowerShell/C# helper), streaming `{ x, y, vx, vy, isClicked }` over IPC `global-mouse`.
4. **IF** the OS stream is silent, the renderer **SHALL** fall back to DOM `mousemove`/`mousedown`.
5. Global shortcuts: `Ctrl+Shift+B` toggles visibility, `Alt+Q` / `Ctrl+Alt+Q` quit, `Ctrl+Alt+B` clears.
6. The render loop **SHALL** use `setInterval(16ms)` because unfocused transparent windows throttle `requestAnimationFrame`.

### R2. Cursor-Driven Blood States
1. **State A (Moving)**: **WHEN** speed >= 1.5 px/tick, the engine **SHALL** leave a continuous smear; faster gives thinner streaks, slower thicker ridges.
2. **State B (Idle)**: **WHEN** speed < 1.5 px for more than 180 ms, blood **SHALL** pool at the cursor, growing in mass and radius; past the surface-tension threshold a heavy drop **SHALL** detach and drip down.
3. **State C (Click)**: **WHEN** a click is detected anywhere in Windows, the engine **SHALL** produce a radial burst of 15-25 droplets plus micro-spatter rays and an impact stain, with a wet splat sound. Heavy droplets **SHALL** become drips.
4. **Weapon trigger**: a click **SHALL** throw a weapon (R5) instead of a plain burst only **IF** (a) a 5% random roll succeeds, or (b) it is the 5th click of a rapid combo (each gap <= 320 ms). Throws **SHALL** be at least 1.5 s apart and the combo **SHALL** reset after a throw.

### R3. Drip Physics
1. Drips **SHALL** move stop-and-go: crawl until load beats friction, slip rapidly, then decelerate while losing mass.
2. Heads **SHALL** deposit tail nodes with `tailRadius = headRadius * clamp(1 / (1 + vy * 0.18), 0.2, 0.85)` until they stop and coagulate.
3. Drips **SHALL** meander with `vx = sin(y * 0.07 + seed) * 0.25`.

### R4. Rendering
1. Fluid layers **SHALL** use SVG filter `visceral-goo` (`feGaussianBlur` stdDeviation 4 + alpha matrix) over a fully transparent background. The alpha row is `16 -4` (loosened from `22 -9`, which cut off thin trails).
2. Fluid **SHALL** have 3 layers: rim `#2a0000` with drop shadow `rgba(15,0,0,0.75)`, arterial body `#8f0303`-`#b80404`, specular highlight `rgba(255,215,215,0.85)` offset top-left.

### R5. Weapon Throw & Glass Shatter
1. Items **SHALL** load from `assets/weapons/` (`knife.png`, `axe.png`, `pumpkin.png`, `kiro-ghost.png`) with procedural canvas art used when a file is missing.
2. Spawn weights: knife 35%, axe 30%, pumpkin 20%, ghost 15%. Flight **SHALL** last 90-130 ms from an off-screen corner or the foreground.
3. Knife/axe **SHALL** scale 2.6 -> 1.0, spin 2-3 turns and lock exactly at -45..-40 deg (from left) or -35..-30 deg (from right) at t = 1, with the blade edge on the target and a 150 ms damped spring recoil.
4. Pumpkin **SHALL** tumble ~180 deg, squash `1.25 x 0.8 -> 1.0` on impact, and burst into glowing pulp, seeds and orange/crimson juice drips.
5. Ghost **SHALL** stay upright with a side-to-side wobble, scale 2.8 -> 1.0, squish flat on impact and slide down over 2.5 s leaving purple `#9b30ff` / green `#39ff14` slime trails mixed with blood.
6. Each impact **SHALL** draw 8-14 jagged radial cracks with fractal branches and 2-4 spiderweb rings, double-stroked with `rgba(0,0,0,0.8)` shadow and `rgba(235,248,255,0.92)` highlight.
7. Knife/axe **SHALL** be clipped along a jagged fault line set about half the blade width in from the cutting edge (knife 50, axe 64 art px), so the front half of the blade is fully hidden in the glass, with seam shading and a drop shadow.
8. Drip emitters **SHALL** run from the crack center and the lowest visible blade point on the seam.

### R6. Procedural Audio (Web Audio only)
1. Knife/axe: high-pass noise burst (2500-6000 Hz, 60 ms), 4-6 sine pings (1800-4200 Hz), 90 -> 30 Hz thud over 120 ms.
2. Pumpkin / blood: band-pass noise (400-1200 Hz) with fast LFO modulation.
3. Ghost: triangle glide 600 -> 220 Hz with vibrato plus a wet squish.

### R7. Lifecycle
1. Weapons and cracks **SHALL** stay pinned 6-10 s, then slip and fade (max 12 live weapons).
2. Fluid **SHALL** age: 0-4 s fresh, 4-10 s darkening to `#3b0303` with shrinking highlight, 10-15 s alpha fade and removal.
3. Node count **SHALL** stay bounded (cap 9000). Streaks and drip tails **SHALL** be stored as capsule segments, and drips **SHALL** drain mass per pixel (`dm/dy = -(0.01 + 0.012 m)`) so they stop after roughly 90-200 px. At the cap, new nodes recycle old slots instead of being dropped.