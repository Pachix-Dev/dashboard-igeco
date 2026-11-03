// Precio original del módulo Scan Leads: $6,960 MXN por licencia.
export const SCANLEADS_MODULE_PRICE_CENTS = 696000;
export const SCANLEADS_CURRENCY = 'MXN';
export const SCANLEADS_MAX_QUANTITY = 50;

export function isScanLeadsQuantity(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value)
    && value >= 1 && value <= SCANLEADS_MAX_QUANTITY;
}

export function scanLeadsPaymentReference(userId: number, quantity: number) {
  return `scanleads:${userId}:${quantity}`;
}

export function amountInCents(value: unknown): number | null {
  if (typeof value !== 'string' || !/^\d+(\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(cents) ? cents : null;
}
