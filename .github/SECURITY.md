# Security Policy

Keyforge is a cryptographic tool. Its entire purpose is to produce strong, unpredictable
secrets. A security flaw — weakened entropy, a predictable output, a side-channel leak —
directly undermines what the tool exists to do. Please report vulnerabilities responsibly.

---

## Supported versions

| Version | Supported |
|---------|-----------|
| Latest (`dev` branch / current deploy) | Yes |
| Older snapshots | No — please update to the latest build |

Keyforge is a continuously deployed SPA; there are no versioned releases yet. The supported
version is always the latest code on the `dev` branch and whatever is live at the deployed URL.

---

## Scope

**In scope:**

- Weaknesses in entropy collection (`crypto.getRandomValues`, `performance.now`, mouse/keyboard
  event timing, hardware fingerprinting).
- Flaws in the key derivation or output formatting logic (`src/lib/crypto.ts`).
- Predictable or biased output for any supported key type (Hex, Base64, API key, UUID v4, PIN).
- Situations where generated key material is persisted, leaked, or transmitted off-device
  unintentionally (this would be a critical bug — the design guarantee is 100% offline).
- Cross-site scripting (XSS) or content injection that could intercept generated keys.
- Significant reduction in effective key space or entropy quality.

**Out of scope:**

- Vulnerabilities in upstream dependencies (please report those to the respective projects).
- Issues that require physical access to the user's device.
- Theoretical weaknesses with no practical exploit path.
- Browser bugs that are not specific to Keyforge's implementation.

---

## Reporting a vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.** Publicly disclosing
a vulnerability before a fix is available puts users at risk.

Instead, use one of these private channels:

**Option 1 — GitHub private advisory (preferred):**

Go to the [Security Advisories page](https://github.com/Im-Fran/keyforge/security/advisories/new)
and create a private advisory. GitHub keeps it confidential until it is published.

**Option 2 — Email:**

Send an email to **f.solism@icloud.com** with the subject line:

```
[SECURITY] <brief description>
```

Include in your report:

- A clear description of the vulnerability.
- The component or file(s) affected (e.g., `src/lib/crypto.ts`, the mouse entropy collector).
- Steps to reproduce or a proof-of-concept (even a rough one helps enormously).
- The potential impact — what can an attacker achieve?
- A suggested fix if you have one (optional but appreciated).

---

## What to expect

| Milestone | Target |
|-----------|--------|
| Acknowledgment of receipt | Within 48 hours |
| Severity assessment and status update | Within 7 days |
| Fix timeline communicated | Once severity is assessed |
| Public disclosure | Coordinated with reporter after fix is deployed |

We follow responsible disclosure: we will work with you to agree on a public disclosure date
after the fix is live. Credit will be given in the advisory unless you prefer to remain anonymous.

---

## Cryptographic design notes

For reporters evaluating the entropy pipeline:

- **System entropy** is gathered via `crypto.getRandomValues`, `performance.now`, `Date.now`,
  and available hardware/navigator properties.
- **Human entropy** is gathered from mouse movement coordinates and keyboard event timing
  during an explicit user interaction step.
- All entropy is mixed into an `EntropyPool` and then passed through a SHA-2 derivation
  (SHA-256, SHA-384, or SHA-512 — user-selectable) via the Web Crypto API.
- No generated keys, entropy bytes, or intermediate state ever leave the browser. There are
  no network requests from `src/`.
