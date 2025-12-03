# Sistema de Gestión de Sesiones con PayPal - IGECO Dashboard

## 📋 Descripción

Sistema completo de gestión de sesiones activas con límites por usuario y pagos vía PayPal para comprar slots adicionales. Similar al sistema de licencias de Adobe Creative Cloud.

## 🚀 Características Implementadas

### 1. **Gestión de Sesiones Activas**

- ✅ Límite de sesiones simultáneas por usuario (`maxsessions`)
- ✅ Tracking de dispositivos activos (IP, user-agent, last_activity)
- ✅ Visualización en tiempo real de sesiones activas
- ✅ Cierre remoto de sesiones desde cualquier dispositivo
- ✅ Limpieza automática de sesiones expiradas (>24h)
- ✅ Validación al intentar iniciar sesión en nuevo dispositivo

### 2. **Integración PayPal**

- ✅ Compra de slots adicionales
- ✅ Procesamiento seguro de pagos
- ✅ Registro de transacciones en base de datos
- ✅ Actualización automática de límite al confirmar pago
- ✅ Recibos por correo (opcional, ya existe infraestructura)

### 3. **Migración a Server Components**

- ✅ Scan-leads convertido a server component
- ✅ Prefetch de sesiones en servidor
- ✅ Server actions para todas las mutaciones
- ✅ Revalidación automática de caché

## 📦 Archivos Creados/Modificados

### Nuevos Archivos

#### SQL

- `sql/create_active_sessions_table.sql` - Tablas para sesiones y pagos

#### Server Actions

- `src/lib/actions/sessions.ts` - Todas las operaciones de sesiones
  - `getUserSessions()` - Obtener sesiones del usuario
  - `registerSession()` - Registrar nueva sesión
  - `closeSession(id)` - Cerrar sesión específica
  - `recordSessionPayment()` - Registrar pago de slots
  - `cleanupExpiredSessions()` - Limpiar sesiones viejas

#### Componentes

- `src/components/scannleads/SessionManager.tsx` - UI gestión de sesiones
- `src/components/scannleads/BuySessionSlots.tsx` - UI compra con PayPal

#### Traducciones

- `SESSIONS_TRANSLATIONS.md` - Traducciones ES/EN/IT para agregar

### Archivos Modificados

- `src/app/[locale]/dashboard/scan-leads/page.tsx` - Migrado a server component
- `src/components/scannleads/ScanLeadsClient.jsx` - Integración UI sesiones
- `src/messages/es.json` - (Pendiente agregar traducciones)

## 🔧 Instalación

### 1. Ejecutar SQL

```sql
-- Conecta a tu base de datos y ejecuta:
source sql/create_active_sessions_table.sql;
```

### 2. Instalar Dependencias

```bash
npm install @paypal/react-paypal-js
```

### 3. Configurar Variables de Entorno

Agrega a tu `.env.local`:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id_de_paypal
PAYPAL_CLIENT_SECRET=tu_secret_de_paypal

# Existing vars
JWT_SECRET=tu_jwt_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=hfmexico_dashboard
```

### 4. Obtener Credenciales PayPal

#### Sandbox (Desarrollo)

1. Ve a https://developer.paypal.com/
2. Inicia sesión con tu cuenta PayPal
3. Ve a "Dashboard" → "Apps & Credentials"
4. En "Sandbox", crea una nueva app
5. Copia el "Client ID" → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

#### Production

1. Cambia a "Live" en PayPal Developer Dashboard
2. Crea app de producción
3. Usa las credenciales Live en tu `.env.production`

### 5. Agregar Traducciones

Abre `src/messages/es.json` y antes del cierre final `}` agrega:

```json
,
"SessionManager": {
  "title": "Gestión de Sesiones",
  "subtitle": "Administra tus sesiones activas en diferentes dispositivos",
  "loading": "Cargando sesiones...",
  "sessionsUsed": "Sesiones Usadas",
  "limitReached": "Límite de sesiones alcanzado",
  "limitReachedDesc": "Has alcanzado el límite de sesiones simultáneas. Cierra alguna sesión o compra más slots.",
  "current": "Actual",
  "unknownDevice": "Dispositivo desconocido",
  "lastActivity": "Última actividad",
  "created": "Creada",
  "closeSession": "Cerrar sesión",
  "noSessions": "No hay sesiones activas",
  "confirmCloseTitle": "¿Cerrar esta sesión?",
  "confirmCloseDesc": "El dispositivo será desconectado inmediatamente y deberá iniciar sesión nuevamente.",
  "cancel": "Cancelar",
  "confirm": "Cerrar sesión",
  "sessionClosed": "Sesión cerrada exitosamente",
  "error": "Error al gestionar la sesión"
},
"BuySessionSlots": {
  "buySlots": "Comprar Slots",
  "title": "Comprar Slots de Sesión",
  "subtitle": "Aumenta el límite de dispositivos simultáneos",
  "currentSlots": "Slots Actuales",
  "selectSlots": "Selecciona la cantidad de slots",
  "customAmount": "Cantidad personalizada",
  "slotsToAdd": "Slots a agregar",
  "pricePerSlot": "Precio por slot",
  "total": "Total",
  "newTotal": "Nuevo total",
  "processing": "Procesando pago...",
  "securePayment": "Pago seguro con PayPal",
  "securePaymentDesc": "Tu información está protegida. Los slots se activarán inmediatamente después del pago.",
  "purchaseSuccess": "¡Compra exitosa! Se agregaron {slots} slots",
  "purchaseError": "Error al procesar el pago. Intenta nuevamente."
}
```

Repite para `src/messages/en.json` e `src/messages/it.json` con las traducciones correspondientes.

## 🎯 Uso

### Para Usuarios

1. **Acceder a Scan Leads**
   - Ve a Dashboard → Scan Leads
   - Verás un banner con tus sesiones activas

2. **Gestionar Sesiones**
   - Click en "Gestionar Sesiones"
   - Lista de dispositivos activos con IP, última actividad
   - Botón "Cerrar sesión" para dispositivos remotos
   - La sesión actual está marcada claramente

3. **Comprar Más Slots**
   - Click en "Comprar Slots"
   - Selecciona cantidad (1, 2, 5, 10 o personalizada)
   - Completa pago con PayPal
   - Slots se activan inmediatamente

### Para Administradores

```sql
-- Ver todas las sesiones activas
SELECT u.name, u.email, COUNT(s.id) as sessions, u.maxsessions
FROM users u
LEFT JOIN active_sessions s ON u.id = s.user_id
GROUP BY u.id;

-- Ver pagos de slots
SELECT u.name, sp.amount_slots, sp.amount_paid, sp.payment_status, sp.created_at
FROM session_payments sp
JOIN users u ON sp.user_id = u.id
ORDER BY sp.created_at DESC;

-- Actualizar límite manualmente
UPDATE users SET maxsessions = 10 WHERE id = 123;
```

## 🔒 Flujo de Seguridad

### Registro de Sesión

1. Usuario inicia sesión → JWT generado
2. Middleware verifica JWT
3. Server action `registerSession()` se ejecuta automáticamente
4. Si `activeSessions < maxSessions`: sesión permitida
5. Si `activeSessions >= maxSessions`: mostrar lista para cerrar otra sesión

### Validación Continua

- Middleware valida en cada request
- Sessions expiradas (>24h) se limpian automáticamente
- `last_activity` se actualiza en cada navegación

### Compra de Slots

1. Usuario selecciona cantidad
2. PayPal procesa pago
3. Webhook/callback confirma
4. `recordSessionPayment()` registra transacción
5. Si `status === 'COMPLETED'`: incrementa `maxsessions`
6. Revalida caché y recarga página

## 📊 Modelo de Datos

### Tabla: `active_sessions`

```sql
id INT PRIMARY KEY AUTO_INCREMENT
user_id INT (FK → users.id)
session_token VARCHAR(500) UNIQUE
device_info VARCHAR(500)
ip_address VARCHAR(45)
user_agent TEXT
last_activity TIMESTAMP
created_at TIMESTAMP
```

### Tabla: `session_payments`

```sql
id INT PRIMARY KEY AUTO_INCREMENT
user_id INT (FK → users.id)
payment_id VARCHAR(100) UNIQUE
amount_slots INT
amount_paid DECIMAL(10,2)
currency VARCHAR(3)
previous_limit INT
new_limit INT
payment_status VARCHAR(50)
applied TINYINT(1)
created_at TIMESTAMP
updated_at TIMESTAMP
completed_at TIMESTAMP NULL
```

## 🎨 Precio y Configuración

### Modificar Precio por Slot

Edita `src/components/scannleads/BuySessionSlots.tsx`:

```typescript
const SLOT_PRICE = 100 // Cambiar aquí (en MXN)
```

### Modificar Tiempo de Expiración

Edita `src/lib/actions/sessions.ts`:

```typescript
// Cambiar INTERVAL 24 HOUR por el tiempo deseado
'WHERE user_id = ? AND last_activity > DATE_SUB(NOW(), INTERVAL 24 HOUR)'
```

## 🐛 Troubleshooting

### PayPal no carga

- Verifica `NEXT_PUBLIC_PAYPAL_CLIENT_ID` en `.env.local`
- Asegúrate de usar Client ID (no Secret)
- En producción, usa credenciales Live

### Sesiones no se registran

- Verifica que las tablas SQL existan
- Revisa logs del servidor para errores
- Confirma que `JWT_SECRET` esté configurado

### El usuario no puede iniciar sesión

```sql
-- Revisar sesiones activas del usuario
SELECT * FROM active_sessions WHERE user_id = [ID];

-- Forzar cierre de todas las sesiones
DELETE FROM active_sessions WHERE user_id = [ID];
```

## 📝 Próximos Pasos (Opcionales)

- [ ] Notificaciones por email al cerrar sesión remota
- [ ] Historial de sesiones cerradas
- [ ] Estadísticas de uso por usuario
- [ ] Webhooks de PayPal para confirmación asíncrona
- [ ] Panel admin para gestionar sesiones globalmente
- [ ] Rate limiting en APIs de sesiones

## 🤝 Soporte

Para dudas o issues:

1. Revisa este README
2. Revisa logs del servidor (`npm run dev`)
3. Verifica configuración de PayPal
4. Consulta documentación de PayPal: https://developer.paypal.com/docs/

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0.0
