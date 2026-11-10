import 'server-only'; // esta se utiliza para asegurar que el código solo se ejecute en el servidor
import { createHash, timingSafeEqual } from 'node:crypto';
import type { RowDataPacket } from 'mysql2';
import { NextResponse } from 'next/server';
import db, { db_scanleads } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { getScanLeadValue, scanLeadFields } from '@/lib/scanleads-fields';

export const SCANLEADS_API_RATE_LIMIT = 60;

export class ScanLeadsApiError extends Error {
  constructor(public status: number, public code: string, public retryAfter?: number) {
    super(code);
  }
}


export function apiResponse(body: unknown, status = 200, origin?: string | null) {
  const response = NextResponse.json(body, { status });
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Vary', 'Origin, Authorization');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  response.headers.set('Referrer-Policy', 'no-referrer');
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Expose-Headers', 'Retry-After, X-RateLimit-Limit');
  }
  if (status === 401) response.headers.set('WWW-Authenticate', 'Bearer realm="scanleads"');
  return response;
}

export function apiErrorResponse(error: unknown, origin?: string | null) {
  if (error instanceof ScanLeadsApiError) {
    const response = apiResponse({ error: { code: error.code } }, error.status, origin);
    if (error.retryAfter) response.headers.set('Retry-After', String(error.retryAfter));
    return response;
  }
  const code = (error as { code?: string })?.code;
  // Never log bearer tokens, request bodies, SQL parameters or lead data.
  console.error('Scan Leads API unavailable', { code: code ?? 'INTERNAL_ERROR' });
  return apiResponse({ error: { code: 'SERVICE_UNAVAILABLE' } }, 503, origin);
}

export function positiveInteger(value: unknown, maximum = Number.MAX_SAFE_INTEGER): number {
  if ((typeof value !== 'string' && typeof value !== 'number') || !/^[1-9]\d*$/.test(String(value))) {
    throw new ScanLeadsApiError(400, 'INVALID_REQUEST');
  }
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number > maximum) throw new ScanLeadsApiError(400, 'INVALID_REQUEST');
  return number;
}

export function normalizeApiOrigin(value: string): string {
  let url: URL;
  try { url = new URL(value); } catch { throw new ScanLeadsApiError(400, 'INVALID_ORIGIN'); }
  const localHttp = process.env.NODE_ENV !== 'production' && url.protocol === 'http:' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !localHttp) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash || url.origin.length > 255 || url.hostname.includes('*')) {
    throw new ScanLeadsApiError(400, 'INVALID_ORIGIN');
  }
  return url.origin;
}

function readApiConfig() {
  const userIdText = process.env.SCANLEADS_API_USER_ID?.trim();
  const hash = process.env.SCANLEADS_API_KEY_HASH?.trim();
  let userId: number;
  let origins: string[];
  try {
    userId = positiveInteger(userIdText);
    if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) throw new Error('Missing key hash');
    const entries = (process.env.SCANLEADS_API_ALLOWED_ORIGINS ?? '').split(',').map(value => value.trim()).filter(Boolean);
    if (entries.length > 10) throw new Error('Too many origins');
    origins = Array.from(new Set(entries.map(normalizeApiOrigin)));
  } catch {
    // An incomplete configuration must never fall back to a different account.
    throw new ScanLeadsApiError(503, 'API_NOT_CONFIGURED');
  }
  return { userId, keyHash: Buffer.from(hash!, 'hex'), origins };
}

export function isAllowedPreflightOrigin(origin: string) {
  const config = readApiConfig();
  try { if (normalizeApiOrigin(origin) !== origin) return false; } catch { return false; }
  return config.origins.includes(origin);
}

export function checkPublicApiIpLimit(request: Request) {
  const rate = checkRateLimit('scanleads:ip:' + getClientIp(request), { windowMs: 60_000, maxRequests: 120 });
  if (!rate.success) throw new ScanLeadsApiError(429, 'RATE_LIMITED', Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000)));
}

export async function authenticateApiKey(request: Request) {
  const config = readApiConfig();
  const match = /^Bearer (slk_[A-Za-z0-9_-]{43})$/i.exec(request.headers.get('authorization') ?? '');
  if (!match) throw new ScanLeadsApiError(401, 'INVALID_API_KEY');
  // Bind the hash to the account: changing only USER_ID invalidates the old key.
  const candidate = createHash('sha256').update('scanleads-api:v1:' + config.userId + ':' + match[1]).digest();
  if (!timingSafeEqual(new Uint8Array(candidate), new Uint8Array(config.keyHash))) {
    throw new ScanLeadsApiError(401, 'INVALID_API_KEY');
  }
  const [users] = await db.query<RowDataPacket[]>(
    'SELECT id, role, status, scanleads_purchased FROM users WHERE id = ? LIMIT 1', [config.userId]
  );
  const user = users[0];
  if (!user || !['admin', 'exhibitorplus'].includes(user.role) || Number(user.status) !== 1 || Number(user.scanleads_purchased) !== 1) {
    throw new ScanLeadsApiError(403, 'ACCOUNT_NOT_ELIGIBLE');
  }
  const origin = request.headers.get('origin');
  if (origin) {
    let valid = false;
    try { valid = normalizeApiOrigin(origin) === origin && config.origins.includes(origin); } catch { /* Deny malformed origins. */ }
    if (!valid) throw new ScanLeadsApiError(403, 'ORIGIN_NOT_ALLOWED');
  }
  return { userId: config.userId, origin };
}

export function consumeApiRequest(userId: number) {
  // This counter is shared by this account's requests within one app process.
  const rate = checkRateLimit('scanleads:user:' + userId, { windowMs: 60_000, maxRequests: SCANLEADS_API_RATE_LIMIT });
  if (!rate.success) throw new ScanLeadsApiError(429, 'RATE_LIMITED', Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000)));
}

export function parseLeadsQuery(url: URL) {
  const params = url.searchParams;
  params.forEach((_, key) => {
    if (!['limit', 'cursor'].includes(key) || params.getAll(key).length !== 1) throw new ScanLeadsApiError(400, 'INVALID_QUERY');
  });
  return { limit: positiveInteger(params.get('limit') ?? '50', 100), cursor: params.has('cursor') ? positiveInteger(params.get('cursor')) : 0 };
}

export async function getApiLeads(userId: number, limit: number, cursor: number) {
  const [captures] = await db.query<RowDataPacket[]>(
    `SELECT id, uuid, notes
     FROM leads WHERE user_id = ? AND id > ? ORDER BY id ASC LIMIT ?`, [userId, cursor, limit + 1]
  );
  const page = captures.slice(0, limit);
  const records = new Map<string, Record<string, unknown>>();
  if (page.length) {
    const ids = page.map(capture => capture.uuid);
    const placeholders = ids.map(() => '?').join(',');
    const [visitors] = await db_scanleads.query<RowDataPacket[]>(
      `SELECT uuid, name, paternSurname, email, company, position, phone, municipality, state, postalCode, country
       FROM visitors_ste_2026 WHERE uuid IN (${placeholders})`, ids
    );
    const [exhibitors] = await db.query<RowDataPacket[]>(
      `SELECT uuid, name, lastname, email, company, position, phone FROM exhibitors WHERE uuid IN (${placeholders})`, ids
    );
    const [speakers] = await db.query<RowDataPacket[]>(
      `SELECT uuid, name, COALESCE(position_esp, position) AS position, company FROM ponentes
       WHERE uuid IN (${placeholders}) AND estatus = 1`, ids
    );
    for (const record of [...visitors, ...exhibitors, ...speakers]) {
      const key = String(record.uuid).toLowerCase();
      if (!records.has(key)) records.set(key, record);
    }
  }
  return {
    data: page.map(capture => {
      const record = records.get(String(capture.uuid).toLowerCase());
      return {
        ...Object.fromEntries(scanLeadFields.map(({ key }) => [key, getScanLeadValue(record ?? {}, key)])),
        notes: capture.notes ?? '',
      };
    }),
    pagination: {
      limit, has_more: captures.length > limit,
      next_cursor: captures.length > limit ? String(page[page.length - 1].id) : null,
      last_cursor: page.length ? String(page[page.length - 1].id) : cursor ? String(cursor) : null,
    },
  };
}
