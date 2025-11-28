import { NextResponse } from 'next/server'
import db from '@/lib/db'
import type { Escenario } from '@/types/programa'
import type { RowDataPacket } from 'mysql2'

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM escenarios WHERE active = 1 ORDER BY name ASC'
    )
    return NextResponse.json({
      message: 'Escenarios obtenidos correctamente',
      status: 200,
      data: rows as Escenario[],
    })
    }catch (error) {
    console.error('Error al obtener escenarios:', error)
    return NextResponse.json(
      { message: 'Error al obtener escenarios', status: 500 },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo escenario
export async function POST(req: Request) {
  try {
    const { name, description, location, capacity } = await req.json()

    // Validación
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { message: 'El nombre es requerido', status: 400 },
        { status: 400 }
      )
    }

    const [result]: any = await db.query(
      'INSERT INTO escenarios (name, description, location, capacity) VALUES (?, ?, ?, ?)',
      [name, description || null, location || null, capacity || null]
    )

    return NextResponse.json({
      message: 'Escenario creado correctamente',
      status: 201,
      data: { id: result.insertId },
    })
  } catch (error) {
    console.error('Error al crear escenario:', error)
    return NextResponse.json(
      { message: 'Error al crear escenario', status: 500 },
      { status: 500 }
    )
  }
}

// PUT - Actualizar escenario
export async function PUT(req: Request) {
  try {
    const { id, name, description, location, capacity, active } = await req.json()

    if (!id) {
      return NextResponse.json(
        { message: 'ID es requerido', status: 400 },
        { status: 400 }
      )
    }

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { message: 'El nombre es requerido', status: 400 },
        { status: 400 }
      )
    }

    await db.query(
      'UPDATE escenarios SET name = ?, description = ?, location = ?, capacity = ?, active = ? WHERE id = ?',
      [name, description || null, location || null, capacity || null, active ?? 1, id]
    )

    return NextResponse.json({
      message: 'Escenario actualizado correctamente',
      status: 200,
    })
  } catch (error) {
    console.error('Error al actualizar escenario:', error)
    return NextResponse.json(
      { message: 'Error al actualizar escenario', status: 500 },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar escenario (soft delete)
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

    // Soft delete
    await db.query('UPDATE escenarios SET active = 0 WHERE id = ?', [id])

    return NextResponse.json({
      message: 'Escenario eliminado correctamente',
      status: 200,
    })
  } catch (error) {
    console.error('Error al eliminar escenario:', error)
    return NextResponse.json(
      { message: 'Error al eliminar escenario', status: 500 },
      { status: 500 }
    )
  }
}
