---
name: web-client-debugging
description: Diagnose Encounter+ web-client state, WebSocket, Angular signal, floating-window, map-tool, or upstream-compatibility regressions.
---

Read `STATUS.md` for the current baseline and use `ROADMAP.md` only when the bug
touches an accepted or rejected product decision.

Reproduce the smallest failing interaction and trace it from incoming data or
pointer event through the model/signal to the rendered state. Check for omitted
fields, immutable replacement, equality suppression, stale derived state, and
overlay stacking before adding timers or forced refreshes. For dragging, retain
pointer capture until release so movement does not depend on remaining over the
original element.

Keep the client system-neutral. Player-only previews stay local unless the host
provides explicit permission; app-owned settings and blocking modals remain
above community floating windows. Preserve browser settings and stored player
preferences across upstream model migrations.

Add a regression to the closest existing spec, run `npm run verify`, and state
which behavior still needs a real Encounter+ host. Do not describe a production
build as proof that live updates or native overlays work.
