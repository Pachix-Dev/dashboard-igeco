import {
  apiErrorResponse, apiResponse, assertSecureTransport, authenticateApiKey,
  checkPublicApiIpLimit, consumeApiRequest, getApiLeads, isAllowedPreflightOrigin,
  parseLeadsQuery, SCANLEADS_API_RATE_LIMIT, ScanLeadsApiError,
} from '@/lib/scanleads-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  let origin: string | null = null;
  try {
    assertSecureTransport(request);
    checkPublicApiIpLimit(request);
    const requestedOrigin = request.headers.get('origin');
    if (requestedOrigin && isAllowedPreflightOrigin(requestedOrigin)) origin = requestedOrigin;
    const identity = await authenticateApiKey(request);
    origin = identity.origin;
    consumeApiRequest(identity.userId);
    const { limit, cursor } = parseLeadsQuery(new URL(request.url));
    const response = apiResponse(await getApiLeads(identity.userId, limit, cursor), 200, origin);
    response.headers.set('X-RateLimit-Limit', String(SCANLEADS_API_RATE_LIMIT));
    return response;
  } catch (error) { return apiErrorResponse(error, origin); }
}

export async function OPTIONS(request: Request) {
  try {
    assertSecureTransport(request);
    checkPublicApiIpLimit(request);
    const origin = request.headers.get('origin');
    const method = request.headers.get('access-control-request-method');
    const headers = (request.headers.get('access-control-request-headers') ?? '').toLowerCase().split(',').map(value => value.trim()).filter(Boolean);
    if (!origin || method !== 'GET' || headers.some(header => !['authorization', 'content-type', 'accept'].includes(header)) ||
        !isAllowedPreflightOrigin(origin)) throw new ScanLeadsApiError(403, 'ORIGIN_NOT_ALLOWED');
    const response = apiResponse({ ok: true }, 200, origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
    response.headers.set('Access-Control-Max-Age', '600');
    return response;
  } catch (error) { return apiErrorResponse(error); }
}
