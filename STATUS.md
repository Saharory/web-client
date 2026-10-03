# Current status

Last updated: 2026-10-04

- Branch: `develop`
- Package version: `0.9.172` (release not yet published)
- Latest published community baseline: Angular 22/TypeScript 6 upstream
  compatibility plus player ruler and area previews, assigned-character effects
  and rolls, independent floating references, and right/bottom initiative dock.
- Automated baseline: all 232 unit tests and the production build pass through
  the maintained `npm run verify` path.
- Native-app baseline: the released community features above were app-tested;
  future changes must distinguish automated success from Encounter+ host and
  live WebSocket verification.
- Current product priority: follow upstream compatibility work. Open research is
  limited to whether assigned-player state can support faster spell access and
  whether the host ever exposes explicit permission for shared templates.

Update this file at a material handoff, app-test result, upstream merge, or
release. Do not use it as a chronological work log.
