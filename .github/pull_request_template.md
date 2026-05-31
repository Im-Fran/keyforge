## Summary

<!-- 1–3 sentences describing what this PR does and why. -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change (existing behavior changes)
- [ ] Docs only
- [ ] Chore / refactor / tooling

## Related issues

<!-- Closes #XXX -->

## Testing done

<!--
Keyforge has no automated test suite yet — manual browser testing is required.
Describe what you tested and in which browsers/environments.

Example:
- Ran `pnpm dev` and completed the full 3-step wizard
- Verified all 5 key types (Hex, Base64, API key, UUID v4, PIN) generate correctly
- Confirmed the copy-to-clipboard button works in Chrome 126 / macOS
- Tested dark mode and all accent color presets
-->

## Screenshots

<!-- For UI or visual changes. Delete this section if not applicable. -->

## Checklist

- [ ] `pnpm lint` passes with no new errors or warnings
- [ ] `pnpm build` completes successfully
- [ ] I manually tested the affected flow end-to-end in at least one browser
- [ ] I self-reviewed the diff — no debug logs, commented-out code, or accidental files
- [ ] Docs or comments updated if behavior changed
- [ ] No entropy, keys, or user data is sent off-device (new code stays browser-only)
