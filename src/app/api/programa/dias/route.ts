import { NextResponse } from 'next/server'
import db from '@/lib/db'
import type { ProgramaDia } from '@/types/programa'
import { RowDataPacket } from 'mysql2'

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Obtener días por escenario o todos
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const escenarioId = url.searchParams.get('escenario_id')

    let query = `
      SELECT pd.*, e.name as escenario_name, e.location as escenario_location
      FROM programa_dias pd
      LEFT JOIN escenarios e ON pd.escenario_id = e.id
      WHERE pd.active = 1
    `
    const params: any[] = []

    if (escenarioId) {
      query += ' AND pd.escenario_id = ?'
      params.push(escenarioId)
    }
    query += ' ORDER BY pd.date ASC'

    const [rows] = await db.query<RowDataPacket[]>(query, params)

    return NextResponse.json({    
      message: 'Días obtenidos correctamente',
      status: 200,
      data: rows,
    })
  } catch (error) {
    console.error('Error al obtener días:', error)
    return NextResponse.json(
      { message: 'Error al obtener días', status: 500 },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo día
export async function POST(req: Request) {
  try {
    const { escenario_id, date, name, description } = await req.json()

    if (!escenario_id || !date) {
      return NextResponse.json(
        { message: 'Escenario y fecha son requeridos', status: 400 },
        { status: 400 }
      )
    }

    // Verificar que el escenario existe
    const [escenario]: any = await db.query(
      'SELECT id FROM escenarios WHERE id = ? AND active = 1',
      [escenario_id]
    )

    if (!escenario || escenario.length === 0) {
      return NextResponse.json(
        { message: 'Escenario no encontrado', status: 404 },
        { status: 404 }
      )
    }

    const [result]: any = await db.query(
      'INSERT INTO programa_dias (escenario_id, date, name, description) VALUES (?, ?, ?, ?)',
      [escenario_id, date, name || null, description || null]
    )

    return NextResponse.json({
      message: 'Día creado correctamente',
      status: 201,
      data: { id: result.insertId },
    })
  } catch (error: any) {
    console.error('Error al crear día:', error)
    
    // Verificar si es error de duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { message: 'Ya existe un día con esta fecha en este escenario', status: 409 },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: 'Error al crear día', status: 500 },
      { status: 500 }
    )
  }
}

// PUT - Actualizar día
export async function PUT(req: Request) {
  try {
    const { id, escenario_id, date, name, description, active } = await req.json()

    if (!id || !escenario_id || !date) {
      return NextResponse.json(
        { message: 'ID, escenario y fecha son requeridos', status: 400 },
        { status: 400 }
      )
    }

    await db.query(
      'UPDATE programa_dias SET escenario_id = ?, date = ?, name = ?, description = ?, active = ? WHERE id = ?',
      [escenario_id, date, name || null, description || null, active ?? 1, id]
    )

    return NextResponse.json({
      message: 'Día actualizado correctamente',
      status: 200,
    })
  } catch (error) {
    console.error('Error al actualizar día:', error)
    return NextResponse.json(
      { message: 'Error al actualizar día', status: 500 },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar día (soft delete)
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID es requerido', status: 400 },
        { status: 400 }
      )
    }

    await db.query('UPDATE programa_dias SET active = 0 WHERE id = ?', [id])

    return NextResponse.json({
      message: 'Día eliminado correctamente',
      status: 200,
    })
  } catch (error) {
    console.error('Error al eliminar día:', error)
    return NextResponse.json(
      { message: 'Error al eliminar día', status: 500 },
      { status: 500 }
    )
  }
}
