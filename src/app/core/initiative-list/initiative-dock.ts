export type InitiativeDockPosition = 'left' | 'right' | 'bottom';

export const INITIATIVE_DOCK_POSITION_KEY = 'initiativeDockPosition';
export const INITIATIVE_DOCK_LOCKED_KEY = 'initiativeDockLocked';

const positions: InitiativeDockPosition[] = ['left', 'right', 'bottom'];

export function storedInitiativeDockPosition(storage: Storage = localStorage): InitiativeDockPosition {
  const value = storage.getItem(INITIATIVE_DOCK_POSITION_KEY) as InitiativeDockPosition | null;
  return value && positions.includes(value) ? value : 'right';
}

export function storedInitiativeDockLocked(storage: Storage = localStorage): boolean {
  return storage.getItem(INITIATIVE_DOCK_LOCKED_KEY) === 'true';
}

export function saveInitiativeDock(
  position: InitiativeDockPosition,
  locked: boolean,
  storage: Storage = localStorage,
): void {
  storage.setItem(INITIATIVE_DOCK_POSITION_KEY, position);
  storage.setItem(INITIATIVE_DOCK_LOCKED_KEY, String(locked));
}

/**
 * Returns the closest supported screen edge once the pointer enters a docking
 * zone. Keeping the centre of the screen empty makes releasing there cancel
 * the move instead of surprising the player with a new position.
 */
export function initiativeDockTarget(
  clientX: number,
  clientY: number,
  viewportWidth: number,
  viewportHeight: number,
): InitiativeDockPosition | undefined {
  if (viewportWidth <= 0 || viewportHeight <= 0) return undefined;

  const x = Math.min(viewportWidth, Math.max(0, clientX));
  const y = Math.min(viewportHeight, Math.max(0, clientY));
  const threshold = Math.min(180, Math.max(64, Math.min(viewportWidth, viewportHeight) * 0.22));
  const candidates: Array<{ position: InitiativeDockPosition; distance: number }> = [
    { position: 'left', distance: x },
    { position: 'right', distance: viewportWidth - x },
    { position: 'bottom', distance: viewportHeight - y },
  ];
  const closest = candidates.reduce((best, candidate) =>
    candidate.distance < best.distance ? candidate : best,
  );

  return closest.distance <= threshold ? closest.position : undefined;
}
