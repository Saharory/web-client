# Current status

Last updated: 2026-10-04

- Branch: develop; merged contribution/player-client-tools at f6e4e44, including official develop fcebe0a and the effect-badge layering fix. Original fork commit history is retained.
- Package version: 0.9.172. Community manifest name, authors, repository, and local guidance are preserved. No release or tag was created.
- Application source and verification tooling exactly match the tested contribution branch.
- Automated checks: 266 unit tests and production build passed; whitespace and package/manifest version checks passed.
- Native baseline: the user tested the same application source on the contribution branch, including the corrected effect badges. The community-branded package from this merge has not been imported for a separate native check.
- PR #127 remains on contribution/player-client-tools, ready for review and unchanged by this merge: https://github.com/encounterplus/web-client/pull/127.
- Shared measurement/area-effect endpoint integration remains follow-up work; current previews stay browser-local.
