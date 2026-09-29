---
name: web-client-debugging
description: Debug Encounter+ web-client state, WebSocket, signal, window, map-tool, or upstream-integration regressions.
---

Read `STATUS.md` for the current baseline and use `ROADMAP.md` only when the bug
touches an accepted or rejected product decision.

Trace the smallest failure from incoming data or pointer event through the
model/signal to rendering. Check omitted fields, immutable replacement,
equality suppression, stale derivation, and stacking before adding timers or
forced refreshes. Retain pointer capture through drag release.

For visual reports, inspect state, DOM, and CSS first. Use a cropped screenshot
only when the layout cannot be resolved from those sources.

Keep the client system-neutral. Player previews stay local without explicit
host permission; app settings and blocking modals stay above community windows.
Preserve stored preferences across upstream model migrations.

Extend the closest spec, use focused tests while iterating, and run
`npm run verify` once. Report remaining native-host verification separately.
