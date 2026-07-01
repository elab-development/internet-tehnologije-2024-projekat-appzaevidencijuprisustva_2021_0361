const HOLIDAY_API_BASE_URL =
  import.meta.env.VITE_PUBLIC_HOLIDAYS_API_URL ?? 'https://date.nager.at/api/v3';
const DEFAULT_COUNTRY_CODE = import.meta.env.VITE_PUBLIC_HOLIDAYS_COUNTRY ?? 'RS';

export async function fetchPublicHolidays(year, countryCode = DEFAULT_COUNTRY_CODE) {
  const response = await fetch(
    `${HOLIDAY_API_BASE_URL}/PublicHolidays/${year}/${countryCode.toUpperCase()}`,
  );

  if (!response.ok) {
    throw new Error('Public holidays could not be loaded.');
  }

  return response.json();
}

export function groupHolidaysByDate(holidays) {
  return holidays.reduce(
    (grouped, holiday) => ({
      ...grouped,
      [holiday.date]: [...(grouped[holiday.date] ?? []), holiday],
    }),
    {},
  );
}
