import { NextResponse } from 'next/server'
import db from '@/lib/db'

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Obtener el programa completo organizado por escenarios, días y conferencias
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const escenarioId = url.searchParams.get('escenario_id')
    const date = url.searchParams.get('date')

    // Consulta base usando la vista
    let query = `
      SELECT 
        e.id AS escenario_id,
        e.name AS escenario_name,
        e.description AS escenario_description,
        e.location AS escenario_location,
        e.capacity AS escenario_capacity,
        pd.id AS dia_id,
        pd.date AS dia_date,
        pd.name AS dia_name,
        pd.description AS dia_description,
        pc.id AS conferencia_id,
        pc.title AS conferencia_title,
        pc.description AS conferencia_description,
        pc.start_time,
        pc.end_time,
        pc.room,
        pc.type AS conferencia_type,
        pc.capacity AS conferencia_capacity,
        pc.tags
      FROM escenarios e
      LEFT JOIN programa_dias pd ON e.id = pd.escenario_id AND pd.active = 1
      LEFT JOIN programa_conferencias pc ON pd.id = pc.dia_id AND pc.active = 1
      WHERE e.active = 1
    `

    const params: any[] = []

    if (escenarioId) {
      query += ' AND e.id = ?'
      params.push(escenarioId)
    }

    if (date) {
      query += ' AND pd.date = ?'
      params.push(date)
    }

    query += ' ORDER BY e.name, pd.date, pc.start_time'

    const [rows]: any = await db.query(query, params)

    // Obtener todos los ponentes de las conferencias
    const conferenciaIds = rows
      .filter((row: any) => row.conferencia_id)
      .map((row: any) => row.conferencia_id)

    let ponentes: any = []
    if (conferenciaIds.length > 0) {
      const [ponentesResult]: any = await db.query(
        `SELECT pcp.conferencia_id, pcp.role, pcp.order_index,
                p.id, p.name, p.position, p.company, p.photo, p.bio_esp, p.bio_eng
         FROM programa_conferencia_ponentes pcp
         LEFT JOIN ponentes p ON pcp.ponente_id = p.id
         WHERE pcp.conferencia_id IN (?)
         ORDER BY pcp.conferencia_id, pcp.order_index`,
        [conferenciaIds]
      )
      ponentes = ponentesResult
    }

    // Organizar los datos en una estructura jerárquica
    const programaOrganizado: any = {}

    rows.forEach((row: any) => {
      // Inicializar escenario si no existe
      if (!programaOrganizado[row.escenario_id]) {
        programaOrganizado[row.escenario_id] = {
          id: row.escenario_id,
          name: row.escenario_name,
          description: row.escenario_description,
          location: row.escenario_location,
          capacity: row.escenario_capacity,
          dias: {},
        }
      }

      // Si hay día
      if (row.dia_id) {
        // Inicializar día si no existe
        if (!programaOrganizado[row.escenario_id].dias[row.dia_id]) {
          programaOrganizado[row.escenario_id].dias[row.dia_id] = {
            id: row.dia_id,
            date: row.dia_date,
            name: row.dia_name,
            description: row.dia_description,
            conferencias: [],
          }
        }

        // Si hay conferencia
        if (row.conferencia_id) {
          const conferencia = {
            id: row.conferencia_id,
            title: row.conferencia_title,
            description: row.conferencia_description,
            start_time: row.start_time,
            end_time: row.end_time,
            room: row.room,
            type: row.conferencia_type,
            capacity: row.conferencia_capacity,
            tags: row.tags ? JSON.parse(row.tags) : [],
            ponentes: ponentes.filter(
              (p: any) => p.conferencia_id === row.conferencia_id
            ),
          }

          programaOrganizado[row.escenario_id].dias[row.dia_id].conferencias.push(
            conferencia
          )
        }
      }
    })

    // Convertir objetos a arrays
    const resultado = Object.values(programaOrganizado).map((escenario: any) => ({
      ...escenario,
      dias: Object.values(escenario.dias),
    }))

    // Calcular estadísticas
    const stats = {
      total_escenarios: resultado.length,
      total_dias: resultado.reduce((sum: number, e: any) => sum + e.dias.length, 0),
      total_conferencias: resultado.reduce(
        (sum: number, e: any) =>
          sum + e.dias.reduce((s: number, d: any) => s + d.conferencias.length, 0),
        0
      ),
      total_ponentes: new Set(ponentes.map((p: any) => p.id)).size,
    }

    return NextResponse.json({
      message: 'Programa completo obtenido correctamente',
      status: 200,
      data: resultado,
      stats,
    })
  } catch (error) {
    console.error('Error al obtener programa completo:', error)
    return NextResponse.json(
      { message: 'Error al obtener programa completo', status: 500 },
      { status: 500 }
    )
  }
}
