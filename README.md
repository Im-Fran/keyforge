<div align="center">

# Keyforge

**A browser-based secret token generator that combines system entropy and human entropy to produce cryptographically strong keys — 100% offline, nothing ever leaves your device.**

[![License](https://img.shields.io/github/license/Im-Fran/keyforge)](LICENSE)
[![Deploy to Cloudflare](https://img.shields.io/github/actions/workflow/status/Im-Fran/keyforge/deploy.yml?label=Deploy)](https://github.com/Im-Fran/keyforge/actions)

</div>

---

## Overview

Keyforge is a single-page application that walks you through a 3-step wizard to generate unpredictable secret tokens. It draws entropy from two independent sources — your browser's CSPRNG and hardware environment, then your own mouse movements — and mixes them together before deriving the final key using the Web Crypto API.

Every computation runs inside your browser. There are no server calls, no analytics, no storage of generated keys. The design guarantee is strict: if any code path were to transmit key material off-device, it would be treated as a critical security bug.

The wizard produces tokens in five formats — hexadecimal, Base64 URL-safe, alphanumeric API key, UUID v4, and numeric PIN — at strengths from 128 to 512 bits, with three derivation algorithms to choose from (SHA-256, SHA-512, and PBKDF2 with 210,000 iterations).

---

## Features

- **Dual-source entropy** — system entropy (`crypto.getRandomValues`, `performance.now`, `Date.now`, screen geometry, navigator properties, heap jitter) is blended with human entropy (mouse coordinates and movement timing captured on a live canvas)
- **Optional media entropy** — upload an image or capture a live camera frame to add pixel data as an additional entropy source
- **Five output formats** — Hex, Base64 URL-safe, alphanumeric API key, UUID v4, numeric PIN (4/6/8 digits)
- **Three derivation algorithms** — SHA-256 (default), SHA-512, PBKDF2 (210,000 iterations)
- **Strength selector** — 128, 256, or 512 bits of entropy for variable-length formats
- **Live entropy pool inspector** — shows byte count and a rolling FNV-1a fingerprint so you can see the pool evolve in real time
- **Copy, download, reveal/hide** — one-click clipboard copy, download as `.txt`, and a blur toggle for shoulder-surfing protection
- **Themeable UI** — light/dark mode, five accent color presets (indigo, blue, cyan, green, magenta), all persisted in `localStorage` via a tweaks panel
- **Fully offline** — deployed as a Cloudflare Workers static-asset SPA; no backend, no network requests from application code

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 with React Compiler |
| Language | TypeScript 6 (strict) |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 (via Vite plugin) + CSS custom properties |
| Crypto | Web Crypto API (`crypto.subtle`, `crypto.getRandomValues`) — browser-native, no library |
| Deployment | Cloudflare Workers (static asset hosting, SPA routing) |
| Package manager | pnpm |

---

## Requirements

- **Node.js** 20 or later (LTS recommended)
- **pnpm** 9 or later — install with `npm i -g pnpm`
- **Wrangler** and a **Cloudflare account** — only needed for `pnpm preview` and `pnpm deploy`; plain development with `pnpm dev` requires nothing beyond Node and pnpm

---

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:Im-Fran/keyforge.git
cd keyforge
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm dev
```

Vite starts a local dev server with hot-module replacement. Open the URL it prints (typically `http://localhost:5173`) in any modern browser.

No environment variables or accounts are needed for local development.

---

## Available Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start the Vite dev server with HMR |
| `pnpm build` | Type-check with `tsc -b`, then bundle with Vite into `dist/` |
| `pnpm preview` | Build, then run `wrangler dev` to simulate the Cloudflare Workers environment locally |
| `pnpm deploy` | Build, then deploy to Cloudflare Workers with `wrangler deploy` |
| `pnpm lint` | Run ESLint across the entire codebase |

---

## Project Structure

```
src/
  components/
    Header.tsx          # App header — theme toggle, algorithm picker, tweaks button
    Stepper.tsx         # Step indicator for the 3-step wizard
    SystemEntropy.tsx   # Step 1 — collects system entropy sources, optional image/camera
    HumanEntropy.tsx    # Step 2 — animated canvas for mouse movement entropy
    KeyResult.tsx       # Step 3 — format/strength picker, generated key, copy/download
    TweaksPanel.tsx     # Slide-in panel for appearance and generator preferences
    Icon.tsx            # SVG icon component (sprite-based)
    ui.tsx              # Shared primitives (Button, Chip, Segmented, PoolBar, etc.)
  lib/
    crypto.ts           # EntropyPool, localSources(), TOKEN_TYPES, ALGOS, formatters
  App.tsx               # Root — wizard state machine, theme/accent wiring
  index.css             # CSS custom properties (theme tokens, accent hue, animations)
public/
  favicon.svg
  icons.svg             # Icon sprite
wrangler.jsonc          # Cloudflare Workers config (SPA routing, nodejs_compat)
```

Key invariant: `src/lib/crypto.ts` uses only the Web Crypto API. Nothing in `src/` makes a network request. Any change that breaks this guarantee will not be accepted.

---

## Deployment

Keyforge is deployed as a Cloudflare Workers SPA. `wrangler.jsonc` configures `not_found_handling: "single-page-application"` so all routes serve `index.html`, and `nodejs_compat` is enabled as a compatibility flag.

### Deploy to Cloudflare Workers

```bash
# One-time: authenticate with Cloudflare
npx wrangler login

# Build and deploy
pnpm deploy
```

Wrangler reads the project name (`keyforge`) and compatibility date from `wrangler.jsonc`. The first deploy creates the Workers project automatically.

### Preview the Workers build locally

```bash
pnpm preview
```

This runs a full production build followed by `wrangler dev`, which replicates the Cloudflare SPA routing locally — useful to catch any Workers-specific issues before pushing.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) before opening a PR — it covers the development setup, branch naming conventions, commit message format (Conventional Commits), and the manual testing checklist that all PRs must pass.

Quick workflow:

1. Fork the repo and clone your fork
2. Create a branch from `dev`: `git checkout -b feat/your-feature`
3. Make your changes — run `pnpm lint` and `pnpm build` before pushing
4. Open a PR against the `dev` branch and fill out the PR template

Changes to `src/lib/crypto.ts` or any entropy collection logic are held to a higher standard. See the "Security-sensitive changes" section of CONTRIBUTING.md for details.

---

## Security

Keyforge is a cryptographic tool. A weakness in entropy collection or key derivation directly undermines its purpose.

If you find a vulnerability, **do not open a public issue**. Instead:

- Open a [private GitHub Security Advisory](https://github.com/Im-Fran/keyforge/security/advisories/new) (preferred), or
- Email **f.solism@icloud.com** with the subject `[SECURITY] <brief description>`

See [SECURITY.md](.github/SECURITY.md) for the full disclosure policy, scope definition, and response timeline.

---

## License

See the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with coffee by <a href="https://franciscosolis.cl">Fran</a>
</div>
