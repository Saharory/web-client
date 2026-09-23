export type EntityFrameAction = EntityRollAction | EntityReferenceAction;

export interface EntityRollAction {
  kind: 'roll';
  formula: string;
  name: string;
  rollType?: 'check' | 'save' | 'attack' | 'damage';
}

export interface EntityReferenceAction {
  kind: 'reference';
  reference: string;
  title: string;
}

const ROLL_TYPES = new Set(['check', 'save', 'attack', 'damage']);

function rollFormula(value: string): string | undefined {
  const normalized = value
    .trim()
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .replace(/\s+/g, '');

  if (/^[+-]?\d+$/.test(normalized)) {
    const modifier = Number(normalized);
    if (!Number.isFinite(modifier)) return undefined;
    return modifier > 0 ? `1d20+${modifier}` : modifier < 0 ? `1d20${modifier}` : '1d20';
  }

  if (/^d\d+/i.test(normalized)) return `1${normalized}`;
  if (/^\d+d\d+/i.test(normalized)) return normalized;
  return undefined;
}

function rollLabel(value?: string | null): { name: string; rollType?: EntityRollAction['rollType'] } {
  const label = (value || '').trim();
  const segments = label.split('/');
  const possibleType = segments.length > 1 ? segments[segments.length - 1].toLowerCase() : '';

  if (ROLL_TYPES.has(possibleType)) {
    return {
      name: segments.slice(0, -1).join('/').trim() || 'Custom',
      rollType: possibleType as EntityRollAction['rollType'],
    };
  }

  return { name: label || 'Custom' };
}

export function entityFrameAction(anchor: HTMLAnchorElement, appBaseURL: string): EntityFrameAction | undefined {
  const rawHref = (anchor.getAttribute('href') || '').trim();
  if (!rawHref || rawHref.startsWith('#') || /^javascript:/i.test(rawHref)) return undefined;
  if (anchor.target && anchor.target.toLowerCase() !== '_self') return undefined;

  const rollMatch = rawHref.match(/^(?:\.\/)?\/?roll(?:\/([^?#]+))?(?:[?#].*)?$/i);
  if (rollMatch) {
    const pathFormula = rollMatch[1] ? decodeURIComponent(rollMatch[1]) : '';
    const formula = rollFormula(pathFormula) || rollFormula(anchor.textContent || '');
    if (!formula) return undefined;

    return {
      kind: 'roll',
      formula,
      ...rollLabel(anchor.getAttribute('title')),
    };
  }

  try {
    const base = new URL(appBaseURL);
    const destination = new URL(rawHref, `${base.origin}/`);
    if (destination.origin !== base.origin) return undefined;

    return {
      kind: 'reference',
      reference: `${destination.pathname}${destination.search}${destination.hash}`,
      title: (anchor.textContent || '').trim() || 'Reference',
    };
  } catch {
    return undefined;
  }
}

export function rollCommand(action: EntityRollAction): string {
  const safeName = action.name.replace(/[\[\]]/g, '').trim() || 'Custom';
  const label = action.rollType ? `${safeName}:${action.rollType}` : safeName;
  return `/roll ${action.formula} [${label}]`;
}
