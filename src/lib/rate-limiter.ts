/**
 * Rate Limiter para proteger endpoints de abuso
 * Implementa rate limiting basado en IP
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

// Limpiar entradas antiguas cada 10 minutos
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, 10 * 60 * 1000);

interface RateLimitOptions {
  windowMs: number; // Ventana de tiempo en milisegundos
  maxRequests: number; // Máximo número de requests en la ventana
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Verifica si una IP ha excedido el límite de peticiones
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}`;

  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    // Crear nueva entrada o resetear
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + options.windowMs
    };

    return {
      success: true,
      limit: options.maxRequests,
      remaining: options.maxRequests - 1,
      reset: rateLimitStore[key].resetTime
    };
  }

  // Incrementar contador
  rateLimitStore[key].count++;

  const remaining = Math.max(0, options.maxRequests - rateLimitStore[key].count);
  const success = rateLimitStore[key].count <= options.maxRequests;

  return {
    success,
    limit: options.maxRequests,
    remaining,
    reset: rateLimitStore[key].resetTime
  };
}

/**
 * Obtener IP del request (considerando proxies)
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback para desarrollo
  return 'unknown-ip';
}

// Presets comunes
export const RATE_LIMITS = {
  // Para login: 5 intentos por 15 minutos
  AUTH: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5
  },
  // Para registro: 3 por hora
  REGISTER: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3
  },
  // Para forgot password: 3 por hora
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3
  },
  // Para APIs generales: 100 por 15 minutos
  API_GENERAL: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100
  }
};
