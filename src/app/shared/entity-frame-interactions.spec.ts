import { entityFrameAction, rollCommand } from './entity-frame-interactions';

describe('entity frame interactions', () => {
  function anchor(href: string, text: string, title?: string): HTMLAnchorElement {
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('href', href);
    link.textContent = text;
    if (title) link.title = title;
    return link;
  }

  it('turns a linked modifier into a named d20 roll', () => {
    const action = entityFrameAction(anchor('roll', '+7', 'Jaws/attack'), 'http://127.0.0.1:8080');

    expect(action).toEqual({ kind: 'roll', formula: '1d20+7', name: 'Jaws', rollType: 'attack' });
    expect(rollCommand(action as any)).toBe('/roll 1d20+7 [Jaws:attack]');
  });

  it('uses a dice formula embedded in a roll path', () => {
    const action = entityFrameAction(anchor('/roll/d20%2B3', '+3', 'Perception'), 'http://127.0.0.1:8080');
    expect(action).toEqual({ kind: 'roll', formula: '1d20+3', name: 'Perception' });
  });

  it('opens same-host rules as references', () => {
    const action = entityFrameAction(
      anchor('/condition/frightened-player-core', 'Frightened'),
      'http://127.0.0.1:8080',
    );
    expect(action).toEqual({
      kind: 'reference',
      reference: '/condition/frightened-player-core',
      title: 'Frightened',
    });
  });

  it('leaves external and new-window links alone', () => {
    expect(entityFrameAction(anchor('https://example.com/rule', 'Rule'), 'http://127.0.0.1:8080')).toBeUndefined();
    const image = anchor('/data/token.png', 'Image');
    image.target = '_blank';
    expect(entityFrameAction(image, 'http://127.0.0.1:8080')).toBeUndefined();
  });
});
