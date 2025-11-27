import db, { db_re_eco } from './db';

/**
 * Obtiene información del estado del pool de conexiones
 */
export async function getPoolStatus() {
  try {
    const pool = db as any;
    const pool2 = db_re_eco as any;
    
    return {
      primary: {
        totalConnections: pool.pool?._allConnections?.length || 0,
        freeConnections: pool.pool?._freeConnections?.length || 0,
        queuedRequests: pool.pool?._connectionQueue?.length || 0,
      },
      secondary: {
        totalConnections: pool2.pool?._allConnections?.length || 0,
        freeConnections: pool2.pool?._freeConnections?.length || 0,
        queuedRequests: pool2.pool?._connectionQueue?.length || 0,
      }
    };
  } catch (error) {
    console.error('Error al obtener estado del pool:', error);
    return null;
  }
}

/**
 * Ejecuta una query con logging para debug
 */
export async function queryWithLogging(
  queryString: string,
  params?: any[],
  operation: string = 'query'
) {
  const start = Date.now();
  
  try {
    const result = await db.query(queryString, params);
    const duration = Date.now() - start;
    
    if (duration > 1000) {
      console.warn(`⚠️ Query lenta (${duration}ms) - ${operation}:`, {
        query: queryString.substring(0, 100),
        duration
      });
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ Error en query (${duration}ms) - ${operation}:`, error);
    throw error;
  }
}

/**
 * Limpia conexiones inactivas del pool
 */
export async function cleanupConnections() {
  try {
    // Ejecutar un query simple para limpiar conexiones inactivas
    await db.query('SELECT 1');
    await db_re_eco.query('SELECT 1');
    
    console.log('✅ Limpieza de conexiones completada');
  } catch (error) {
    console.error('Error al limpiar conexiones:', error);
  }
}

// Monitor periódico del pool (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  setInterval(async () => {
    const status = await getPoolStatus();
    if (status) {
      const primaryUsed = status.primary.totalConnections - status.primary.freeConnections;
      const secondaryUsed = status.secondary.totalConnections - status.secondary.freeConnections;
      
      if (primaryUsed > 7 || secondaryUsed > 7) {
        console.warn('⚠️ Alto uso de conexiones:', {
          primary: `${primaryUsed}/10 activas`,
          secondary: `${secondaryUsed}/10 activas`,
        });
      }
    }
  }, 30000); // Cada 30 segundos
}
