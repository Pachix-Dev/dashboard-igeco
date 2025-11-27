import { NextResponse } from 'next/server'
import db from '@/lib/db'
import type { Conferencia, ConferenciaPonente } from '@/types/programa'

// GET - Obtener conferencias por día o todas
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const diaId = url.searchParams.get('dia_id')
    const conferenciaId = url.searchParams.get('id')

    if (conferenciaId) {
      // Obtener una conferencia específica con sus ponentes
      const [conferencias]: any = await Promise.race([
        db.query(
          `SELECT pc.*, pd.date, pd.name as dia_name, e.name as escenario_name
           FROM programa_conferencias pc
           LEFT JOIN programa_dias pd ON pc.dia_id = pd.id
           LEFT JOIN escenarios e ON pd.escenario_id = e.id
           WHERE pc.id = ? AND pc.active = 1`,
          [conferenciaId]
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 5000)
        )
      ])

      if (conferencias.length === 0) {
        return NextResponse.json(
          { message: 'Conferencia no encontrada', status: 404 },
          { status: 404 }
        )
      }

      // Obtener ponentes de la conferencia
      const [ponentes]: any = await Promise.race([
        db.query(
          `SELECT pcp.*, p.name, p.position, p.company, p.photo
           FROM programa_conferencia_ponentes pcp
           LEFT JOIN ponentes p ON pcp.ponente_id = p.id
           WHERE pcp.conferencia_id = ?
           ORDER BY pcp.order_index`,
          [conferenciaId]
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 5000)
        )
      ])

      conferencias[0].ponentes = ponentes

      return NextResponse.json({
        message: 'Conferencia obtenida correctamente',
        status: 200,
        data: conferencias[0],
      })
    }

    // Obtener conferencias por día o todas
    let query = `
      SELECT pc.*, pd.date, pd.name as dia_name, e.name as escenario_name,
             COUNT(pcp.id) as total_ponentes
      FROM programa_conferencias pc
      LEFT JOIN programa_dias pd ON pc.dia_id = pd.id
      LEFT JOIN escenarios e ON pd.escenario_id = e.id
      LEFT JOIN programa_conferencia_ponentes pcp ON pc.id = pcp.conferencia_id
      WHERE pc.active = 1
    `
    const params: any[] = []

    if (diaId) {
      query += ' AND pc.dia_id = ?'
      params.push(diaId)
    }

    query += ' GROUP BY pc.id ORDER BY pc.start_time ASC'

    const [rows] = (await Promise.race([
      db.query(query, params),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      )
    ])) as [Conferencia[], any]

    return NextResponse.json({
      message: 'Conferencias obtenidas correctamente',
      status: 200,
      data: rows,
    })
  } catch (error) {
    console.error('Error al obtener conferencias:', error)
    return NextResponse.json(
      { message: 'Error al obtener conferencias', status: 500 },
      { status: 500 }
    )
  }
}

// POST - Crear nueva conferencia con ponentes
export async function POST(req: Request) {
  let connection;
  
  try {
    connection = await db.getConnection()
    await connection.beginTransaction()

    const {
      dia_id,
      title,
      title_eng,
      description,
      description_eng,
      start_time,
      end_time,
      room,
      type,
      capacity,
      tags,
      ponentes,
    } = await req.json()

    // Validación
    if (!dia_id || !title || !title_eng || !start_time || !end_time) {
      await connection.rollback()
      return NextResponse.json(
        { message: 'Día, título, título en inglés, hora inicio y hora fin son requeridos', status: 400 },
        { status: 400 }
      )
    }

    // Verificar que el día existe
    const [dia]: any = await connection.query(
      'SELECT id FROM programa_dias WHERE id = ? AND active = 1',
      [dia_id]
    )

    if (!dia || dia.length === 0) {
      await connection.rollback()
      return NextResponse.json(
        { message: 'Día no encontrado', status: 404 },
        { status: 404 }
      )
    }

    // Insertar conferencia
    const [result]: any = await connection.query(
      `INSERT INTO programa_conferencias 
       (dia_id, title, title_eng, description, description_eng, start_time, end_time, room, type, capacity, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dia_id,
        title,
        title_eng,
        description || null,
        description_eng || null,
        start_time,
        end_time,
        room || null,
        type || 'presentation',
        capacity || null,
        tags ? JSON.stringify(tags) : null,
      ]
    )

    const conferenciaId = result.insertId

    // Insertar ponentes si existen
    if (ponentes && Array.isArray(ponentes) && ponentes.length > 0) {
      for (const ponente of ponentes) {
        await connection.query(
          `INSERT INTO programa_conferencia_ponentes 
           (conferencia_id, ponente_id, role, order_index) 
           VALUES (?, ?, ?, ?)`,
          [
            conferenciaId,
            ponente.ponente_id,
            ponente.role || 'speaker',
            ponente.order_index || 0,
          ]
        )
      }
    }

    await connection.commit()

    return NextResponse.json({
      message: 'Conferencia creada correctamente',
      status: 201,
      data: { id: conferenciaId },
    })
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback()
      } catch (rollbackError) {
        console.error('Error en rollback:', rollbackError)
      }
    }
    console.error('Error al crear conferencia:', error)
    return NextResponse.json(
      { message: 'Error al crear conferencia', status: 500 },
      { status: 500 }
    )
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

// PUT - Actualizar conferencia
export async function PUT(req: Request) {
  let connection;

  try {
    connection = await db.getConnection()
    await connection.beginTransaction()

    const {
      id,
      dia_id,
      title,
      title_eng,
      description,
      description_eng,
      start_time,
      end_time,
      room,
      type,
      capacity,
      tags,
      active,
      ponentes,
    } = await req.json()

    if (!id || !dia_id || !title || !title_eng || !start_time || !end_time) {
      await connection.rollback()
      return NextResponse.json(
        { message: 'ID, día, título, título en inglés, hora inicio y hora fin son requeridos', status: 400 },
        { status: 400 }
      )
    }

    // Actualizar conferencia
    await connection.query(
      `UPDATE programa_conferencias 
       SET dia_id = ?, title = ?, title_eng = ?, description = ?, description_eng = ?, start_time = ?, end_time = ?, 
           room = ?, type = ?, capacity = ?, tags = ?, active = ?
       WHERE id = ?`,
      [
        dia_id,
        title,
        title_eng,
        description || null,
        description_eng || null,
        start_time,
        end_time,
        room || null,
        type || 'presentation',
        capacity || null,
        tags ? JSON.stringify(tags) : null,
        active ?? 1,
        id,
      ]
    )

    // Si se proporcionan ponentes, actualizar la relación
    if (ponentes && Array.isArray(ponentes)) {
      // Eliminar ponentes anteriores
      await connection.query(
        'DELETE FROM programa_conferencia_ponentes WHERE conferencia_id = ?',
        [id]
      )

      // Insertar nuevos ponentes
      for (const ponente of ponentes) {
        await connection.query(
          `INSERT INTO programa_conferencia_ponentes 
           (conferencia_id, ponente_id, role, order_index) 
           VALUES (?, ?, ?, ?)`,
          [
            id,
            ponente.ponente_id,
            ponente.role || 'speaker',
            ponente.order_index || 0,
          ]
        )
      }
    }

    await connection.commit()

    return NextResponse.json({
      message: 'Conferencia actualizada correctamente',
      status: 200,
    })
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback()
      } catch (rollbackError) {
        console.error('Error en rollback:', rollbackError)
      }
    }
    console.error('Error al actualizar conferencia:', error)
    return NextResponse.json(
      { message: 'Error al actualizar conferencia', status: 500 },
      { status: 500 }
    )
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

// DELETE - Eliminar conferencia (soft delete)
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

    await db.query('UPDATE programa_conferencias SET active = 0 WHERE id = ?', [id])

    return NextResponse.json({
      message: 'Conferencia eliminada correctamente',
      status: 200,
    })
  } catch (error) {
    console.error('Error al eliminar conferencia:', error)
    return NextResponse.json(
      { message: 'Error al eliminar conferencia', status: 500 },
      { status: 500 }
    )
  }
}
