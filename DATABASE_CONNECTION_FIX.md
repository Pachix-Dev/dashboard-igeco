# Correcciones al Problema de "Too Many Connections"

## 🔍 Problema Identificado

La aplicación experimentaba errores `ER_CON_COUNT_ERROR: Too many connections` debido a:

- Pool de conexiones sin límites configurados
- Conexiones que no se liberaban correctamente en caso de error
- Falta de timeouts en queries
- No había monitoreo del estado del pool

## ✅ Soluciones Implementadas

### 1. Configuración del Pool de Conexiones (`src/lib/db.ts`)

**Antes:**

```typescript
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})
```

**Después:**

```typescript
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Máximo 10 conexiones simultáneas
  waitForConnections: true, // Esperar si no hay conexiones
  queueLimit: 0, // Sin límite de cola
  enableKeepAlive: true, // Mantener conexiones vivas
  keepAliveInitialDelay: 0,
  connectTimeout: 10000, // Timeout de 10s para conectar
})
```

**Mejoras:**

- ✅ Límite de 10 conexiones simultáneas
- ✅ Cola de espera cuando todas las conexiones están ocupadas
- ✅ Keep-alive para detectar conexiones muertas
- ✅ Timeout de 10 segundos para evitar conexiones colgadas

### 2. Manejo Seguro de Conexiones (`src/app/api/programa/conferencias/route.ts`)

**Antes:**

```typescript
export async function POST(req: Request) {
  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    // ... código ...
    await connection.commit()
  } catch (error) {
    await connection.rollback()
  } finally {
    connection.release() // ⚠️ Falla si hay error antes
  }
}
```

**Después:**

```typescript
export async function POST(req: Request) {
  let connection
  try {
    connection = await db.getConnection()
    await connection.beginTransaction()
    // ... código ...
    await connection.commit()
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback()
      } catch (rollbackError) {
        console.error('Error en rollback:', rollbackError)
      }
    }
  } finally {
    if (connection) {
      try {
        connection.release()
      } catch (releaseError) {
        console.error('Error al liberar conexión:', releaseError)
      }
    }
  }
}
```

**Mejoras:**

- ✅ Declaración de `connection` fuera del try
- ✅ Verificación antes de rollback/release
- ✅ Manejo seguro de errores en rollback y release
- ✅ Garantiza liberación de conexión incluso con errores

### 3. Timeouts en Queries (GET)

**Agregado:**

```typescript
const [rows] = (await Promise.race([
  db.query(query, params),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Query timeout')), 5000)
  ),
])) as [Conferencia[], any]
```

**Mejoras:**

- ✅ Timeout de 5 segundos para queries GET
- ✅ Previene queries colgadas que bloquean conexiones

### 4. Sistema de Monitoreo (`src/lib/db-monitor.ts`)

**Nuevo archivo con:**

- `getPoolStatus()`: Obtiene estado del pool en tiempo real
- `queryWithLogging()`: Query con logging de rendimiento
- `cleanupConnections()`: Limpia conexiones inactivas
- Monitor automático cada 30 segundos en desarrollo

**Funciones:**

```typescript
// Ver estado de las conexiones
const status = await getPoolStatus()
console.log(status.primary.freeConnections)

// Query con logging
await queryWithLogging('SELECT * FROM users', [], 'fetchUsers')
```

### 5. Endpoint de Health Check (`src/app/api/health/db/route.ts`)

**Nuevo endpoint:** `GET /api/health/db`

**Respuesta:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-27T...",
  "pools": {
    "primary": {
      "totalConnections": 3,
      "freeConnections": 2,
      "activeConnections": 1,
      "usagePercent": 10,
      "limit": 10
    },
    "secondary": { ... }
  },
  "health": "healthy"
}
```

**Uso:**

```bash
# Verificar estado de conexiones
curl http://localhost:3000/api/health/db
```

## 📊 Monitoreo

### Logs en Desarrollo

El sistema ahora muestra advertencias cuando:

- Una query tarda más de 1 segundo
- El uso de conexiones supera el 70% (7/10)

**Ejemplo:**

```
⚠️ Query lenta (1523ms) - fetchConferencias
⚠️ Alto uso de conexiones: { primary: "8/10 activas" }
```

## 🔧 Configuración Recomendada

### Variables de Entorno

Asegúrate de tener configuradas:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=igeco

DB_HOST2=localhost
DB_USER2=root
DB_PASSWORD2=tu_password
DB_NAME2=re_eco
```

### Configuración MySQL Server

Si el problema persiste, ajusta en el servidor MySQL:

```sql
-- Ver límite actual
SHOW VARIABLES LIKE 'max_connections';

-- Aumentar si es necesario (temporal)
SET GLOBAL max_connections = 200;

-- Verificar conexiones activas
SHOW PROCESSLIST;
```

## 🎯 Resultados Esperados

Después de estas correcciones:

- ✅ No más errores "Too many connections"
- ✅ Conexiones se liberan correctamente
- ✅ Queries tienen timeout para evitar bloqueos
- ✅ Visibilidad del estado del pool
- ✅ Mejor rendimiento general

## 🚀 Próximos Pasos

1. **Monitorea el endpoint**: `/api/health/db`
2. **Revisa los logs** en la terminal durante desarrollo
3. **Ajusta connectionLimit** si necesitas más/menos conexiones
4. **Considera usar transacciones** solo cuando sea necesario

## 📝 Archivos Modificados

1. `src/lib/db.ts` - Configuración del pool
2. `src/app/api/programa/conferencias/route.ts` - Manejo seguro de conexiones
3. `src/lib/db-monitor.ts` - **NUEVO** - Sistema de monitoreo
4. `src/app/api/health/db/route.ts` - **NUEVO** - Health check endpoint

## ⚡ Mejores Prácticas

### ✅ Hacer:

- Usar `db.query()` directamente del pool para queries simples
- Usar `db.getConnection()` solo para transacciones
- Liberar conexiones en bloque `finally`
- Implementar timeouts en queries críticas

### ❌ Evitar:

- Mantener conexiones abiertas innecesariamente
- Transacciones para queries simples
- Queries sin timeout
- Ignorar errores de conexión
