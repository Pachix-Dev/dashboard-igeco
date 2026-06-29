export const STAND_SQUARE_METERS_OPTIONS = [
  9,
  18,
  27,
  36,
  45,
  54,
  63,
  72,
  81,
  90,
  99,
  108,
] as const;

export function normalizeSquareMeters(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const numericValue = Number(value);
  return STAND_SQUARE_METERS_OPTIONS.includes(
    numericValue as (typeof STAND_SQUARE_METERS_OPTIONS)[number]
  )
    ? numericValue
    : null;
}

export function formatSquareMeters(value: unknown): string | null {
  const numericValue = normalizeSquareMeters(value);
  return numericValue ? `${numericValue} m2` : null;
}
