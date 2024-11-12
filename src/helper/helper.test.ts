import { formatDate } from '.';

describe('formatDate', () => {
  it('should format a valid date string to "Month Day, Year" format', () => {
    expect(formatDate('2020-01-01')).toBe('January 1, 2020');
    expect(formatDate('2021-12-31')).toBe('December 31, 2021');
    expect(formatDate('2019-07-04')).toBe('July 4, 2019');
  });

  it('should return an empty string if dateString is empty', () => {
    expect(formatDate('')).toBeUndefined();
  });

  it('should handle dates with leading zeros in day and month', () => {
    expect(formatDate('2020-04-05')).toBe('April 5, 2020');
    expect(formatDate('2020-09-09')).toBe('September 9, 2020');
  });

  it('should return undefined if the month value is invalid', () => {
    expect(formatDate('2020-13-01')).toBeUndefined(); // Invalid month
  });
});
