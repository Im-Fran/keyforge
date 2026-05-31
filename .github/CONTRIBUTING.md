# Contributing to Keyforge

Keyforge is a browser-based secret token generator that combines system entropy
(`crypto.getRandomValues`, `performance.now`, hardware fingerprints) with human entropy
(mouse movements, keyboard timing) to produce cryptographically strong keys — without ever
sending a single byte off your device.

Contributions are welcome: bug fixes, new output formats, entropy improvements, accessibility
work, and documentation all help make the tool more useful and trustworthy.

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).
By participating you agree to uphold it.

---

## Ways to contribute

| Type | How |
|---|---|
| Bug report | Open a [Bug Report issue](https://github.com/Im-Fran/keyforge/issues/new?template=bug_report.yml) |
| Feature idea | Open a [Feature Request issue](https://github.com/Im-Fran/keyforge/issues/new?template=feature_request.yml) or start a [Discussion](https://github.com/Im-Fran/keyforge/discussions) |
| Code | Fork, branch, PR (see below) |
| Docs | Same PR process — typo fixes welcome |
| Security | See [SECURITY.md](SECURITY.md) — do NOT open a public issue |

---

## Development setup

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20 or later (LTS recommended) |
| pnpm | 9 or later (`npm i -g pnpm`) |
| A modern browser | Chrome, Firefox, or Safari — needed for manual testing |

> You do **not** need a Cloudflare account to develop locally. `pnpm dev` runs a plain Vite
> dev server in the browser.

### 1. Fork and clone

```bash
# Fork via GitHub, then:
git clone git@github.com:<your-username>/keyforge.git
cd keyforge
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the dev server

```bash
pnpm dev
```

Open `http://localhost:5173` (or the port Vite prints). Hot-module replacement is active —
changes to `src/` reflect instantly.

### 4. Lint

```bash
pnpm lint
```

The project uses ESLint with `typescript-eslint`, `eslint-plugin-react-hooks`, and
`eslint-plugin-react-refresh`. Fix all warnings before submitting a PR.

### 5. Production build

```bash
pnpm build
```

TypeScript is compiled first (`tsc -b`), then Vite bundles the output into `dist/`. A clean
build with no TypeScript errors is required before opening a PR.

### 6. Preview the Cloudflare Workers build locally

```bash
pnpm preview
```

This runs `pnpm build` followed by `wrangler dev`, which simulates the Cloudflare Workers
SPA environment locally. Use this to verify that routing and asset serving behave correctly
before a deploy.

---

## Project structure

```
src/
  components/       # React components (Header, Stepper, SystemEntropy, HumanEntropy, KeyResult, …)
  lib/
    crypto.ts       # EntropyPool, key derivation (SHA-256/384/512), output formatters
  App.tsx           # Root component — wizard state machine, theme/tweaks
  index.css         # CSS custom properties (theme tokens, accent hue)
public/             # Static assets (favicon, icon sprite)
wrangler.jsonc      # Cloudflare Workers / assets config
```

Key invariant: **everything runs in the browser**. `src/lib/crypto.ts` uses only the Web
Crypto API. No fetch calls, no localStorage writes of generated keys, no telemetry.
Any change that would break this invariant will not be accepted.

---

## Branch naming

```
feat/short-description      # new capability
fix/short-description       # bug fix
docs/short-description      # docs-only change
chore/short-description     # tooling, deps, refactor
```

Examples: `feat/argon2-output-format`, `fix/human-entropy-safari-pointer-events`,
`docs/update-contributing`.

---

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description (imperative, max 72 chars)

Optional body explaining the motivation or tradeoffs.
The body should answer "why", not "what" — the diff shows what.

Closes #123
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Scopes (optional but helpful):** `crypto`, `entropy`, `ui`, `wizard`, `deploy`, `deps`

Examples:

```
feat(crypto): add Argon2id output format via WebAssembly polyfill

fix(entropy): prevent double-firing of onDone when mouse leaves canvas on Safari

chore(deps): bump wrangler to 4.96.0
```

---

## Pull request process

1. **Open an issue first** for any non-trivial change so the approach can be discussed before
   you invest time in implementation.
2. **Create a branch** from `dev` (the default branch), not from `main`.
3. **Open a draft PR early** if you want feedback while still in progress.
4. **Fill out the PR template** completely — especially the "Testing done" section.
5. **Request review** when the PR is ready. One approval from a maintainer is required to merge.
6. **Squash merge** is preferred to keep the history clean. The PR title becomes the squash
   commit message, so make it a valid Conventional Commit line.

---

## Code style

- TypeScript with strict mode — no `any` casts without a comment explaining why.
- React components use function declarations or arrow functions — no class components.
- Inline styles (`style={{ }}`) are the current pattern; keep new UI consistent with existing
  components (CSS custom properties from `index.css`).
- The React Compiler (`babel-plugin-react-compiler`) is enabled — avoid patterns that break
  it (explicit `useMemo`/`useCallback` wrapping is usually unnecessary; let the compiler handle it).
- Prefer explicit types on public function signatures; let TypeScript infer locals.

---

## Testing

Keyforge does not yet have an automated test suite. **Manual browser testing is currently
required** for all PRs. At minimum, test:

1. Full wizard flow: complete Steps 1, 2, and 3 without errors.
2. All five output types: Hex, Base64 URL-safe, API key, UUID v4, PIN — each generates a
   non-empty, correctly formatted result.
3. All three hash algorithms: SHA-256, SHA-384, SHA-512.
4. Dark mode and at least two accent color presets.
5. The browser console shows no errors or warnings during your test run.

If your change touches entropy collection, also test on at least two browsers (e.g.,
Chrome + Firefox or Chrome + Safari), as pointer-event and timing APIs differ.

---

## Security-sensitive changes

Because Keyforge is a cryptographic tool, changes to `src/lib/crypto.ts` or any entropy
collection logic are held to a higher standard:

- Document the entropy source and its estimated quality.
- Do not weaken existing mixing or derivation steps without a clear justification.
- Changes that reduce the effective key space or introduce predictability will be rejected.
- If you discover a security issue, follow the [responsible disclosure process](SECURITY.md)
  rather than opening a public PR.

---

## Questions

Start a [GitHub Discussion](https://github.com/Im-Fran/keyforge/discussions) — it's the best
place for "is this a good idea?" conversations before investing time in code.
