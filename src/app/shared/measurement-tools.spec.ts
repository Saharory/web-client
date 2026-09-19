import { formatMeasurementDistance, measurementDistance } from './measurement-tools';

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
});
