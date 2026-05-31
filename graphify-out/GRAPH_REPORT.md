# Graph Report - .  (2026-05-31)

## Corpus Check
- Corpus is ~10,654 words - fits in a single context window. You may not need a graph.

## Summary
- 107 nodes · 176 edges · 12 communities
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.81)
- Token cost: 3,200 input · 980 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Header & Algorithms|Header & Algorithms]]
- [[_COMMUNITY_Tweaks Panel|Tweaks Panel]]
- [[_COMMUNITY_Key Result Display|Key Result Display]]
- [[_COMMUNITY_Entropy Pool Core|Entropy Pool Core]]
- [[_COMMUNITY_App Entry & Visual Identity|App Entry & Visual Identity]]
- [[_COMMUNITY_System Entropy Sources|System Entropy Sources]]
- [[_COMMUNITY_Icons & Navigation Stepper|Icons & Navigation Stepper]]
- [[_COMMUNITY_Social Media Icons|Social Media Icons]]
- [[_COMMUNITY_Human Entropy Collection|Human Entropy Collection]]
- [[_COMMUNITY_Build & Lint Config|Build & Lint Config]]

## God Nodes (most connected - your core abstractions)
1. `EntropyPool` - 12 edges
2. `Icon()` - 8 edges
3. `index.html — App Entry Point` - 7 edges
4. `icons.svg — SVG Icon Sprite Sheet` - 6 edges
5. `Button()` - 5 edges
6. `StepHeading()` - 4 edges
7. `AlgoId` - 4 edges
8. `React + TypeScript + Vite Template` - 4 edges
9. `Keyforge — Secret Token Generator App` - 4 edges
10. `IconName` - 3 edges

## Surprising Connections (you probably didn't know these)
- `index.html — App Entry Point` --references--> `favicon.svg — App Favicon`  [EXTRACTED]
  index.html → public/favicon.svg
- `Keyforge Logo SVG — Lightning Bolt / Layered Shape` --rationale_for--> `Keyforge — Secret Token Generator App`  [INFERRED]
  public/favicon.svg → index.html
- `Hero Illustration — Isometric Layered Floating Tiles` --rationale_for--> `Keyforge — Secret Token Generator App`  [INFERRED]
  src/assets/hero.png → index.html
- `App()` --calls--> `useTweaks()`  [EXTRACTED]
  src/App.tsx → src/components/TweaksPanel.tsx
- `KeyResult()` --calls--> `entropyBits()`  [EXTRACTED]
  src/components/KeyResult.tsx → src/lib/crypto.ts

## Hyperedges (group relationships)
- **Keyforge UI Visual Identity (favicon + hero + icon sprite)** — faviconsvg_logo, heropng_illustration, iconssvg_sprite [INFERRED 0.85]
- **HTML Font Stack (Plus Jakarta Sans + JetBrains Mono via Google Fonts)** — indexhtml_entrypoint, indexhtml_plusjakartasans, indexhtml_jetbrainsmono [EXTRACTED 1.00]
- **Vite React Plugin Build Options (plugin-react vs plugin-react-swc)** — readme_reactvitetmpl, readme_pluginreact, readme_pluginreactswc [EXTRACTED 1.00]

## Communities (12 total, 0 thin omitted)

### Community 0 - "Header & Algorithms"
Cohesion: 0.14
Nodes (11): Header(), HeaderProps, Button(), AlgoId, AlgoMeta, ALGOS, LocalSource, SourceResult (+3 more)

### Community 1 - "Tweaks Panel"
Cohesion: 0.18
Nodes (12): SelectOption, TweakRow(), TweakSection(), TweakSelect(), TweaksPanel(), TweaksPanelProps, TweakToggle(), TweakValues (+4 more)

### Community 2 - "Key Result Display"
Cohesion: 0.16
Nodes (14): KeyResult(), KeyResultProps, ButtonProps, cardStyle, Chip(), IconBtn(), IconBtnProps, Label() (+6 more)

### Community 3 - "Entropy Pool Core"
Cohesion: 0.25
Nodes (4): concatBytes(), EntropyPool, numToBytes(), strToBytes()

### Community 4 - "App Entry & Visual Identity"
Cohesion: 0.24
Nodes (10): Keyforge Logo SVG — Lightning Bolt / Layered Shape, Hero Illustration — Isometric Layered Floating Tiles, bg-grid CSS Background Layer, index.html — App Entry Point, favicon.svg — App Favicon, JetBrains Mono — Monospace Font (token display), src/main.tsx — Main Script Module, Plus Jakarta Sans — UI Font (+2 more)

### Community 5 - "System Entropy Sources"
Cohesion: 0.25
Nodes (7): hexDump(), InfoModal(), RowState, SystemEntropy(), SystemEntropyProps, bytesFromDrawable(), localSources()

### Community 6 - "Icons & Navigation Stepper"
Cohesion: 0.32
Nodes (6): Icon(), IconName, IconProps, Stepper(), StepperProps, STEPS

### Community 7 - "Social Media Icons"
Cohesion: 0.33
Nodes (7): Bluesky Social Icon, Discord Social Icon, Documentation Icon (purple stroke), GitHub Icon, Social/User Icon (purple stroke), icons.svg — SVG Icon Sprite Sheet, X (Twitter) Icon

### Community 8 - "Human Entropy Collection"
Cohesion: 0.33
Nodes (5): HumanEntropy(), HumanEntropyProps, Particle, PoolBar(), StepHeading()

### Community 9 - "Build & Lint Config"
Cohesion: 0.4
Nodes (5): Type-Aware ESLint Configuration, @vitejs/plugin-react (Oxc), @vitejs/plugin-react-swc (SWC), React Compiler (enabled), React + TypeScript + Vite Template

## Knowledge Gaps
- **35 isolated node(s):** `ACCENT_PRESETS`, `TWEAK_DEFAULTS`, `IconProps`, `TweakValues`, `TweaksPanelProps` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `EntropyPool` connect `Entropy Pool Core` to `Header & Algorithms`, `Tweaks Panel`, `Key Result Display`, `System Entropy Sources`, `Human Entropy Collection`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `Icon()` connect `Icons & Navigation Stepper` to `Header & Algorithms`, `Tweaks Panel`, `Key Result Display`, `System Entropy Sources`, `Human Entropy Collection`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `ACCENT_PRESETS`, `TWEAK_DEFAULTS`, `IconProps` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Header & Algorithms` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._