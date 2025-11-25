# 🔒 SEGURIDAD - Configuración Requerida

## ⚠️ IMPORTANTE - ANTES DE DESPLEGAR A PRODUCCIÓN

### 1. Configurar JWT_SECRET

El secret JWT **DEBE** estar configurado en las variables de entorno. **NUNCA** uses el valor por defecto en producción.

```bash
# Generar un secret fuerte (ejecutar en terminal)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Agregar al archivo `.env`:

```env
JWT_SECRET=tu_secret_generado_aqui_64_caracteres_minimo
```

### 2. Verificar Variables de Entorno

Asegúrate de que todas estas variables estén configuradas:

```env
# Base de datos principal
DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_base_datos

# Base de datos secundaria
DB_HOST2=tu_host2
DB_USER2=tu_usuario2
DB_PASSWORD2=tu_password2
DB_NAME2=tu_base_datos2

# JWT Secret (CRÍTICO)
JWT_SECRET=generar_con_comando_arriba

# Email
RESEND_API_KEY=tu_api_key

# URL de la aplicación
NEXT_PUBLIC_APP_URL=https://tu-dominio.com

# Entorno
NODE_ENV=production
```

### 3. Requisitos de Contraseñas

Todas las contraseñas ahora deben cumplir con:

- ✅ Mínimo 8 caracteres
- ✅ Al menos una letra minúscula
- ✅ Al menos una letra mayúscula
- ✅ Al menos un número
- ✅ Al menos un carácter especial (!@#$%^&\*()\_+-=[]{}...)
- ❌ No puede ser una contraseña común

**Usuarios existentes**: Deberán actualizar sus contraseñas en el próximo inicio de sesión.

### 4. Rate Limiting Configurado

Los siguientes endpoints tienen límites de peticiones:

| Endpoint               | Límite     | Ventana    |
| ---------------------- | ---------- | ---------- |
| `/api/auth` (Login)    | 5 intentos | 15 minutos |
| `/api/register`        | 3 intentos | 1 hora     |
| `/api/forgot-password` | 3 intentos | 1 hora     |

### 5. Headers de Seguridad

Los siguientes headers de seguridad se han configurado:

- ✅ `X-Frame-Options: DENY` (previene clickjacking)
- ✅ `X-Content-Type-Options: nosniff` (previene MIME sniffing)
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `X-XSS-Protection: 1; mode=block`
- ✅ `Permissions-Policy` (restringe APIs del navegador)

### 6. Cookies Seguras

Las cookies de autenticación ahora:

- ✅ `httpOnly: true` (no accesibles desde JavaScript)
- ✅ `secure: true` en producción (solo HTTPS)
- ✅ `sameSite: 'strict'` (protección CSRF)
- ✅ Expiración: 7 días

### 7. Validación de Inputs

Todos los inputs ahora son:

- ✅ Validados (email, UUID, roles)
- ✅ Sanitizados (previene XSS)
- ✅ Limitados en longitud
- ✅ Escapados (HTML entities)

### 8. Protección SQL Injection

- ✅ Todas las consultas usan parámetros preparados
- ✅ Validación de UUIDs con regex
- ✅ Límite de 100 UUIDs por consulta
- ✅ Sanitización de arrays dinámicos

## 🚀 Checklist de Despliegue

Antes de desplegar a producción, verifica:

- [ ] JWT_SECRET generado y configurado (64+ caracteres)
- [ ] NODE_ENV=production configurado
- [ ] Todas las variables de entorno configuradas
- [ ] HTTPS habilitado (requerido para cookies seguras)
- [ ] Base de datos en servidor seguro
- [ ] Credenciales de base de datos rotadas
- [ ] API Key de Resend configurada
- [ ] Backups automáticos de base de datos habilitados
- [ ] Monitoreo de errores configurado (Sentry, etc.)
- [ ] Logs configurados para auditoría

## 📋 Mejoras Adicionales Recomendadas

### A Corto Plazo (1-2 semanas):

1. **Implementar CSRF tokens** para formularios
2. **Agregar 2FA** (autenticación de dos factores)
3. **Logging de eventos de seguridad**:
   - Intentos de login fallidos
   - Cambios de contraseña
   - Creación/eliminación de usuarios
4. **Limpieza automática de sesiones expiradas** (cronjob)

### A Mediano Plazo (1 mes):

1. **Implementar CAPTCHA** en registro y login
2. **Configurar WAF** (Web Application Firewall)
3. **Auditoría de dependencias** (npm audit, Snyk)
4. **Penetration testing**
5. **Backup y disaster recovery plan**

### A Largo Plazo (3 meses):

1. **OAuth/SSO** (Google, Microsoft)
2. **Geolocalización de sesiones**
3. **Alertas de seguridad** en tiempo real
4. **Compliance** (GDPR, SOC2)

## 🔍 Monitoreo

Configura alertas para:

- ⚠️ Múltiples intentos de login fallidos (posible ataque de fuerza bruta)
- ⚠️ Rate limit excedido frecuentemente (posible DDoS)
- ⚠️ Errores JWT (tokens manipulados)
- ⚠️ Cambios masivos de contraseñas (posible compromiso)

## 📞 Contacto de Seguridad

En caso de vulnerabilidad detectada:

1. No reportar públicamente
2. Contactar al equipo de desarrollo inmediatamente
3. Proporcionar detalles técnicos y pasos de reproducción

---

**Última actualización**: 25 de noviembre de 2025
**Versión**: 2.0.0 (Hardened Security)
