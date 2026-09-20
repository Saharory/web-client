import { alternatingDiagonalMovement, formatMeasurementDistance, measurementDistance } from './measurement-tools';

describe('measurement tools', () => {
  it('converts a precise pixel distance using the map grid scale', () => {
    expect(measurementDistance([0, 0, 30, 40], 10)).toBe(5);
  });

  it('adds every segment in a multi-point measurement', () => {
    expect(measurementDistance([0, 0, 30, 40, 60, 80], 10)).toBe(10);
  });

  it('formats whole and tenth-unit distances without unnecessary zeroes', () => {
    expect(formatMeasurementDistance(5, 'ft')).toBe('5 ft');
    expect(formatMeasurementDistance(40.66, 'ft')).toBe('40.7 ft');
  });

  it('handles incomplete measurements safely', () => {
    expect(measurementDistance([0, 0], 10)).toBe(0);
    expect(measurementDistance([0, 0, 10, 10], 0)).toBe(0);
  });

  it('uses alternating 5-foot and 10-foot diagonal movement', () => {
    expect(alternatingDiagonalMovement([{ horizontal: 1, vertical: 1 }])).toBe(1);
    expect(alternatingDiagonalMovement([{ horizontal: 2, vertical: 2 }])).toBe(3);
    expect(alternatingDiagonalMovement([{ horizontal: 3, vertical: 3 }])).toBe(4);
    expect(alternatingDiagonalMovement([{ horizontal: 4, vertical: 4 }])).toBe(6);
  });

  it('continues the diagonal alternation across multiple segments', () => {
    expect(alternatingDiagonalMovement([
      { horizontal: 1, vertical: 1 },
      { horizontal: 1, vertical: 1 }
    ])).toBe(3);
  });
});
