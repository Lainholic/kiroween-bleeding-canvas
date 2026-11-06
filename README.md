# 🩸 Bleeding Canvas — Kiroween 2026 (Costume Contest)

> **"Dress your entire Windows desktop in a haunting, interactive horror costume."**  
> An ultra-visceral, zero-clickthrough transparent desktop overlay powered by pure HTML5 Canvas, SVG Gooey filters, procedural Web Audio, and native OS mouse telemetry.

[![Kiroween 2026](https://img.shields.io/badge/Kiroween_2026-Costume_Contest-ff4500?style=for-the-badge&logo=ghost)](https://kiroween.devpost.com)
[![Kiro Spec-Driven](https://img.shields.io/badge/Kiro-Spec--Driven-8a2be2?style=for-the-badge)](https://kiro.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🎬 Video Demo

[![Watch the Demo](https://img.youtube.com/vi/iRvqFxc6hGc/maxresdefault.jpg)](https://youtu.be/iRvqFxc6hGc)

👉 **Watch the full walkthrough on YouTube**: [https://youtu.be/iRvqFxc6hGc](https://youtu.be/iRvqFxc6hGc)

---

## 🎃 What It Does

Bleeding Canvas turns your entire display into a living, responsive Halloween nightmare that runs silently on top of all your applications without interrupting your workflow:

1. **Cursor Kinetic Scent**: Slashing cursor trails with speed-proportional droplet scattering.
2. **Dwell Pooling & Viscous Dripping**: When the mouse rests, blood accumulates into high-tension pools. When gravity exceeds surface tension, realistic dripping trails run down your screen.
3. **Visceral Arsenal Strikes (Click & Drag)**:
   - **Axe (Slashing Chopper)**: Heavy arterial sprays with directional momentum.
   - **Knife (Stab Wound)**: Radial puncture splatters and intense pooling.
   - **Pumpkin (Halloween Smasher)**: Pulp chunks, seed particles, and orange splatter.
   - **Kiro Ghost (Ectoplasm)**: Fluorescent purple spectral residue with ethereal trails.
4. **Procedural Web Audio**: Zero external audio samples. All splatters, squishes, and drip echoes are synthesized procedurally in real-time via the Web Audio API.
5. **Zero-Clickthrough Transparent Window**: Runs completely pass-through, so you can continue coding, browsing, or gaming while your screen bleeds.

---

## 🛠️ Built With Kiro

This project was built from ground zero using **Kiro's Spec-Driven Development** methodology:

* **`.kiro/specs/requirements.md`**: Defines precise fluid mechanics, frame-rate budgets (60 FPS lock), native input telemetry requirements, and audio constraints.
* **`.kiro/specs/design.md`**: Architectural blueprint separating the multi-canvas layering pipeline (Cracks, Coagulated Rim, Visceral Arterial Body, Ectoplasm, Gloss, Weapons, Particles) and SVG metaball filter matrices.
* **`.kiro/specs/tasks.md`**: Systematic phase-by-phase execution gates ensuring zero memory leaks and rock-solid native process isolation.

---

## ⌨️ Global Shortcuts

* `Ctrl + Shift + B`: Toggle overlay visibility (Hide / Show)
* `Ctrl + Alt + B`: Wipe the screen clean
* `Alt + Q` or `Ctrl + Alt + Q`: Emergency exit

---

## 🚀 Quick Start

### Prerequisites
* Windows 10/11
* Node.js (v18+)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/Lainholic/kiroween-bleeding-canvas.git
cd kiroween-bleeding-canvas

# Install dependencies (Electron)
npm install

# Run the live interactive overlay
npm start

# Or run the hands-free automated scripted showcase demo
npm run demo
```

---

## 📄 License

MIT © [Lainholic](https://github.com/Lainholic)
