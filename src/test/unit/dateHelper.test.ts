import { parseGovUkDate, formatDate, formatDateTime } from '@/utils/dateHelper';

describe('dateHelper', () => {
  describe('parseGovUkDate', () => {
    test('returns ISO datetime string with time components for valid date inputs', () => {
      expect(parseGovUkDate('15', '3', '2024')).toBe('2024-03-15T00:00:00');
      expect(parseGovUkDate('5', '12', '2024')).toBe('2024-12-05T00:00:00');
      expect(parseGovUkDate('1', '1', '2026')).toBe('2026-01-01T00:00:00');
    });

    test('pads single-digit day and month with leading zeros', () => {
      expect(parseGovUkDate('5', '3', '2024')).toBe('2024-03-05T00:00:00');
      expect(parseGovUkDate('10', '3', '2024')).toBe('2024-03-10T00:00:00');
    });

    test('returns undefined when day is missing', () => {
      expect(parseGovUkDate('', '3', '2024')).toBeUndefined();
      expect(parseGovUkDate(undefined, '3', '2024')).toBeUndefined();
    });

    test('returns undefined when month is missing', () => {
      expect(parseGovUkDate('15', '', '2024')).toBeUndefined();
      expect(parseGovUkDate('15', undefined, '2024')).toBeUndefined();
    });

    test('returns undefined when year is missing', () => {
      expect(parseGovUkDate('15', '3', '')).toBeUndefined();
      expect(parseGovUkDate('15', '3', undefined)).toBeUndefined();
    });

    test('returns undefined when all components are missing', () => {
      expect(parseGovUkDate()).toBeUndefined();
      expect(parseGovUkDate('', '', '')).toBeUndefined();
    });
  });

  describe('formatDate', () => {
    test('formats ISO datetime string to UK date format (date only, no time)', () => {
      const result = formatDate('2024-03-15T00:00:00');
      expect(result).toContain('15');
      expect(result).toContain('March');
      expect(result).toContain('2024');
    });

    test('formats ISO datetime string with single digit day', () => {
      const result = formatDate('2024-01-05T00:00:00');
      expect(result).toContain('5');
      expect(result).toContain('January');
      expect(result).toContain('2024');
    });

    test('does not include time components', () => {
      const result = formatDate('2024-03-15T10:30:00');
      expect(result).not.toContain('10:30');
    });
  });

  describe('formatDateTime', () => {
    test('formats ISO datetime string to UK format including time', () => {
      const result = formatDateTime('2024-03-15T10:30:00');
      expect(result).toContain('15');
      expect(result).toContain('March');
      expect(result).toContain('2024');
      expect(result).toContain('10');
      expect(result).toContain('30');
    });

    test('formats midnight timestamp correctly', () => {
      const result = formatDateTime('2024-01-05T00:00:00');
      expect(result).toContain('5');
      expect(result).toContain('January');
      expect(result).toContain('2024');
    });
  });
});
