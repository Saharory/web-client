# Project guidance

This is the system-neutral community Encounter+ web client. Use `ROADMAP.md`
for product decisions and `STATUS.md` for the current handoff; read only the
one relevant to the task.

- Preserve upstream compatibility with Angular 22, TypeScript 6, zoneless
  signals, the current data models, and the video-aware asset pipeline.
- Keep community features system-neutral and player-local unless the server or
  host exposes explicit permission for shared state.
- Prefer authoritative WebSocket/model state and reactive derivation over
  arbitrary delays, repeated polling, or DOM-only synchronization.
- Floating windows must remain independent, draggable through pointer capture,
  responsive at small sizes, and below app-owned settings/modals.
- Extend the closest existing `*.spec.ts` file for a regression. Create a new
  spec only for a genuinely new module with no suitable suite.
- `npm run verify` is the canonical automated check. Native Encounter+ testing
  is still required for host integration, layout, and real-time behavior.
- Do not bump versions, push, or publish until requested. Commit completed local
  work and record pending app verification in `STATUS.md`.
