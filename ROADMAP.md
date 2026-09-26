# Community Web Client Roadmap

Last reviewed: 2026-09-27

This records web-client decisions discovered while reviewing the official
[Encounter+ web client](https://github.com/encounterplus/web-client), older app
source, and support repositories. System/content work is tracked in the PF2E
Remaster repository's `ROADMAP.md`.

## Current maintenance priority

Keep the community features compatible with upstream Encounter+ releases. For
each upstream update, review its data models, WebSocket events, asset pipeline,
manifest requirements, and Angular/TypeScript changes before merging. Preserve
the community settings stored in the browser and verify the importable package
against the currently public Encounter+ app version.

## Completed source-backed player features

- Player ruler with exact and square/PF2E diagonal measurement modes, optional
  individually removable saved measurements, and the player's chosen color.
- Local-only area-template previews for radius, cone, cube, cylinder, and line,
  including affected-square highlighting and final measurements.
- Assigned-character panel with live active-effect badges and rule/details
  windows that remain independent of the character sheet.
- Clickable sheet rolls sent through Encounter+ chat.
- Persistent movable character and rule windows with responsive sizing.
- Right/bottom initiative docking and a named player-turn notification.
- Reactive token/effect reassignment fixes and settings that stay above all
  community floating windows.
- Compatibility with the upstream Angular 22, TypeScript 6, zoneless signals,
  data-model, and video-asset refactor.

## Open investigations

### Faster spell access

Determine whether the server state sent to an assigned player exposes enough
character spell data for a compact favorites/prepared-spells launcher. Search
and bookmarks work today. Do not create a second independent spell database in
the client merely to simulate quick access.

### Explicit GM permission for shared player templates

Local previews are safe because only the player sees them. Publishing a
player's area template to the shared battle map should remain disabled unless
the Encounter+ host exposes a clear GM-controlled permission. Do not infer this
permission from the broad `All` or token-movement interaction modes.

## Deliberately closed or deferred ideas

- **Virtual 3D dice:** rejected; implementing and maintaining a separate visual
  dice renderer is disproportionate to the gain. Chat rolls remain supported.
- **Saved area templates:** not needed for a local preview that disappears when
  the player finishes using it.
- **Left initiative dock:** removed from the design because it conflicts with
  the app's left-side menus. Right and bottom cover the useful cases.
- **Automated PF2E modifiers or duration tracking:** remain outside the generic,
  system-neutral web client's responsibility.

