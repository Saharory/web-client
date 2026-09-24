import {
  initiativeDockTarget,
  saveInitiativeDock,
  storedInitiativeDockLocked,
  storedInitiativeDockPosition,
} from './initiative-dock';

describe('initiative dock preferences', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to an unlocked right dock', () => {
    expect(storedInitiativeDockPosition()).toBe('right');
    expect(storedInitiativeDockLocked()).toBeFalse();
  });

  it('persists the chosen dock and lock state', () => {
    saveInitiativeDock('bottom', true);

    expect(storedInitiativeDockPosition()).toBe('bottom');
    expect(storedInitiativeDockLocked()).toBeTrue();
  });

  it('ignores an unknown stored position', () => {
    localStorage.setItem('initiativeDockPosition', 'top');
    expect(storedInitiativeDockPosition()).toBe('right');
  });
});

describe('initiativeDockTarget', () => {
  it('offers the three supported edges', () => {
    expect(initiativeDockTarget(20, 400, 1000, 800)).toBe('left');
    expect(initiativeDockTarget(980, 400, 1000, 800)).toBe('right');
    expect(initiativeDockTarget(500, 790, 1000, 800)).toBe('bottom');
  });

  it('uses the closest edge in a corner', () => {
    expect(initiativeDockTarget(990, 760, 1000, 800)).toBe('right');
    expect(initiativeDockTarget(900, 790, 1000, 800)).toBe('bottom');
  });

  it('leaves the centre as a cancel zone', () => {
    expect(initiativeDockTarget(500, 400, 1000, 800)).toBeUndefined();
  });
});
