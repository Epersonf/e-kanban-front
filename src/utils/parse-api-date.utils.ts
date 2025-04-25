export function parseApiDate(apiDate: number | string | Date | undefined | null): Date {
  if (apiDate instanceof Date) {
      return apiDate;
  }
  if (typeof apiDate === 'number' || typeof apiDate === 'string') {
      const date = new Date(apiDate);
      if (!isNaN(date.getTime())) {
          return date;
      }
  }
  // Fallback to current date if parsing fails or input is invalid/missing
  console.warn('Invalid date received from API, falling back to current date:', apiDate);
  return new Date();
}