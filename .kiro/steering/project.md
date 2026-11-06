# Project Steering: Kiroween Chrono-FSM

## 1. Project Overview
* **Category**: Skeleton Crew (Kiroween Hackathon 2026)
* **Goal**: Build an ultra-lean, zero-dependency Finite State Machine (FSM) core that directly parses and executes Markdown/Mermaid state diagrams, driving two completely distinct applications:
  1. `Spectral Focus`: A distraction-free productivity Pomodoro timer with emotional buildup.
  2. `Haunted Escape`: An interactive survival mystery text/visual mini-game.

## 2. Core Engineering Principles
* **Zero External Dependencies**: The core FSM engine must not rely on heavyweight external state libraries (e.g. XState, Redux). Pure TypeScript only.
* **Executable Spec**: State diagrams defined in Markdown (`design.md`) are parsed directly into runtime executable transitions.
* **Zero-Loss State Persistence**: FSM snapshots can be serialized into a compact URL hash for instant bookmarking, recovery, and time-travel debugging.
* **Separation of Concerns**: Core engine logic (`src/core/`) remains 100% agnostic of the UI renderer. UI layers subscribe to state events via an EventEmitter interface.
