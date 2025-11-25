/**
 * Utilidades de validación y sanitización
 */

/**
 * Validar formato de email con regex mejorado
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  // RFC 5322 compliant regex (simplified version)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Validaciones adicionales
  if (email.length > 254) return false; // Max length según RFC
  if (email.length < 3) return false; // Min length razonable
  
  return emailRegex.test(email);
}

/**
 * Validar contraseña fuerte
 */
export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateStrongPassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['La contraseña es requerida'] };
  }

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (password.length > 128) {
    errors.push('La contraseña no puede tener más de 128 caracteres');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }

  // Contraseñas comunes prohibidas
  const commonPasswords = [
    'password', 'password123', '12345678', 'qwerty123', 
    'abc123456', 'password1', 'admin123', 'letmein'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Esta contraseña es demasiado común');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitizar string para prevenir XSS
 */
export function sanitizeString(input: string, maxLength: number = 255): string {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input
    .trim()
    .slice(0, maxLength)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized;
}

/**
 * Validar UUID v4
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validar que string solo contenga caracteres alfanuméricos y espacios
 */
export function isAlphanumericWithSpaces(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  return /^[a-zA-Z0-9\s]+$/.test(str);
}

/**
 * Validar longitud de string
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  if (!str || typeof str !== 'string') return false;
  return str.length >= min && str.length <= max;
}

/**
 * Limpiar y validar HTML (para biografías, etc)
 */
export function sanitizeHTML(html: string, maxLength: number = 5000): string {
  if (!html || typeof html !== 'string') return '';

  // Lista blanca de tags permitidos
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'];
  
  let sanitized = html
    .trim()
    .slice(0, maxLength);

  // Remover todos los tags excepto los permitidos
  sanitized = sanitized.replace(/<([^>]+)>/gi, (match, tag) => {
    const tagName = tag.split(' ')[0].toLowerCase().replace('/', '');
    if (allowedTags.includes(tagName)) {
      return match;
    }
    return '';
  });

  // Remover scripts y event handlers
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');

  return sanitized;
}

/**
 * Validar número positivo
 */
export function isPositiveNumber(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Validar role permitido
 */
export function isValidRole(role: string): boolean {
  const validRoles = ['admin', 'exhibitor', 'exhibitorplus'];
  return validRoles.includes(role);
}
