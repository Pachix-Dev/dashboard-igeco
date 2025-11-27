import { NextResponse } from 'next/server';
import { getPoolStatus } from '@/lib/db-monitor';

// Endpoint para monitorear el estado de las conexiones
export async function GET() {
  try {
    const status = await getPoolStatus();
    
    if (!status) {
      return NextResponse.json(
        { message: 'No se pudo obtener el estado del pool' },
        { status: 500 }
      );
    }

    const primaryUsage = status.primary.totalConnections > 0
      ? Math.round((status.primary.totalConnections - status.primary.freeConnections) / 10 * 100)
      : 0;

    const secondaryUsage = status.secondary.totalConnections > 0
      ? Math.round((status.secondary.totalConnections - status.secondary.freeConnections) / 10 * 100)
      : 0;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      pools: {
        primary: {
          ...status.primary,
          activeConnections: status.primary.totalConnections - status.primary.freeConnections,
          usagePercent: primaryUsage,
          limit: 10,
        },
        secondary: {
          ...status.secondary,
          activeConnections: status.secondary.totalConnections - status.secondary.freeConnections,
          usagePercent: secondaryUsage,
          limit: 10,
        }
      },
      health: primaryUsage > 80 || secondaryUsage > 80 ? 'warning' : 'healthy'
    });
  } catch (error) {
    console.error('Error en health check:', error);
    return NextResponse.json(
      { message: 'Error al verificar estado', error: String(error) },
      { status: 500 }
    );
  }
}
