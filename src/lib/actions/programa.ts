'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { Escenario, ProgramaDia, Conferencia } from '@/types/programa';

// Listados
export async function getEscenarios(): Promise<Escenario[]> {
  const [rows] = await db.query<any[]>(
    'SELECT id, name, description, location, capacity, active, created_at, updated_at FROM escenarios ORDER BY id DESC'
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? undefined,
    location: r.location ?? undefined,
    capacity: r.capacity ?? undefined,
    active: !!r.active,
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function getDias(escenarioId?: number): Promise<ProgramaDia[]> {
  let query = `
    SELECT pd.id, pd.escenario_id, pd.date, pd.name, pd.description, pd.active, pd.created_at,
           e.name as escenario_name, e.location as escenario_location
    FROM programa_dias pd
    LEFT JOIN escenarios e ON pd.escenario_id = e.id
    WHERE pd.active = 1
  `;
  const params: any[] = [];
  if (escenarioId) {
    query += ' AND pd.escenario_id = ?';
    params.push(escenarioId);
  }
  query += ' ORDER BY pd.date ASC';
  const [rows] = await db.query<any[]>(query, params);
  return rows as any;
}

export async function getConferencias(diaId?: number): Promise<Conferencia[]> {
  let query = `
    SELECT pc.*, pd.date, pd.name as dia_name, e.name as escenario_name,
           COUNT(pcp.id) as total_ponentes
    FROM programa_conferencias pc
    LEFT JOIN programa_dias pd ON pc.dia_id = pd.id
    LEFT JOIN escenarios e ON pd.escenario_id = e.id
    LEFT JOIN programa_conferencia_ponentes pcp ON pc.id = pcp.conferencia_id
    WHERE pc.active = 1
  `;
  const params: any[] = [];
  if (diaId) {
    query += ' AND pc.dia_id = ?';
    params.push(diaId);
  }
  query += ' GROUP BY pc.id ORDER BY pc.start_time ASC';
  const [rows] = await db.query<any[]>(query, params);
  return rows as any;
}

export async function getConferenciaById(id: number): Promise<any | null> {
  const [confs]: any = await db.query(
    `SELECT pc.*, pd.date, pd.name as dia_name, e.name as escenario_name
     FROM programa_conferencias pc
     LEFT JOIN programa_dias pd ON pc.dia_id = pd.id
     LEFT JOIN escenarios e ON pd.escenario_id = e.id
     WHERE pc.id = ? AND pc.active = 1`,
    [id]
  );
  if (!confs || confs.length === 0) return null;
  const conf = confs[0];
  const [ponentes]: any = await db.query(
    `SELECT pcp.*, p.name, p.position, p.company, p.photo
     FROM programa_conferencia_ponentes pcp
     LEFT JOIN ponentes p ON pcp.ponente_id = p.id
     WHERE pcp.conferencia_id = ?
     ORDER BY pcp.order_index`,
    [id]
  );
  conf.ponentes = ponentes;
  return conf;
}

// Escenarios CRUD
export async function addEscenario(data: { name: string; description?: string; location?: string; capacity?: number }) {
  const { name, description, location, capacity } = data;
  if (!name) return { success: false, error: 'El nombre es requerido' };
  await db.query('INSERT INTO escenarios (name, description, location, capacity, active) VALUES (?, ?, ?, ?, 1)', [name, description || null, location || null, capacity || null]);
  revalidatePath('/[locale]/dashboard/programa', 'page');
  return { success: true };
}

export async function updateEscenario(id: number, data: { name: string; description?: string; location?: string; capacity?: number; active?: boolean }) {
  const { name, description, location, capacity, active } = data;
  if (!name) return { success: false, error: 'El nombre es requerido' };
  await db.query('UPDATE escenarios SET name = ?, description = ?, location = ?, capacity = ?, active = ? WHERE id = ?', [name, description || null, location || null, capacity || null, active ? 1 : 0, id]);
  revalidatePath('/[locale]/dashboard/programa', 'page');
  return { success: true };
}

export async function deleteEscenario(id: number) {
  await db.query('DELETE FROM escenarios WHERE id = ?', [id]);
  revalidatePath('/[locale]/dashboard/programa', 'page');
  return { success: true };
}

// Días CRUD
export async function addDia(data: { escenario_id: number; date: string; name?: string; description?: string }) {
  const { escenario_id, date, name, description } = data;
  if (!escenario_id || !date) return { success: false, error: 'escenario_id y date son requeridos' };
  await db.query('INSERT INTO dias (escenario_id, date, name, description, active) VALUES (?, ?, ?, ?, 1)', [escenario_id, date, name || null, description || null]);
  revalidatePath('/[locale]/dashboard/programa', 'page');
  return { success: true };
}

export async function updateDia(id: number, data: { date: string; name?: string; description?: string; active?: boolean }) {
  const { date, name, description, active } = data;
  if (!date) return { success: false, error: 'date es requerido' };
  await db.query('UPDATE programa_dias SET date = ?, name = ?, description = ?, active = ? WHERE id = ?', [date, name || null, description || null, active ? 1 : 0, id]);
  revalidatePath('/[locale]/dashboard/programa', 'page');
  return { success: true };
}

export async function deleteDia(id: number) {
  await db.query('UPDATE programa_dias SET active = 0 WHERE id = ?', [id]);
  revalidatePath('/[locale]/dashboard/programa', 'page');
  return { success: true };
}

// Conferencias CRUD
export async function addConferencia(data: { dia_id: number; title: string; title_eng: string; description?: string; description_eng?: string; start_time: string; end_time: string; room?: string; type: string; capacity?: number; tags?: any[]; ponentes?: Array<{ ponente_id: number; role?: string; order_index?: number }> }) {
  const { dia_id, title, title_eng, description, description_eng, start_time, end_time, room, type, capacity, tags, ponentes } = data as any;
  if (!dia_id || !title || !title_eng || !start_time || !end_time) return { success: false, error: 'Día, título, título en inglés, hora inicio y hora fin son requeridos' };
  const connection = await (db as any).getConnection();
  try {
    await connection.beginTransaction();
    const [result]: any = await connection.query(
      `INSERT INTO programa_conferencias 
       (dia_id, title, title_eng, description, description_eng, start_time, end_time, room, type, capacity, tags, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [dia_id, title, title_eng, description || null, description_eng || null, start_time, end_time, room || null, type || 'presentation', capacity || null, tags ? JSON.stringify(tags) : null]
    );
    const conferenciaId = result.insertId;
    if (ponentes && Array.isArray(ponentes) && ponentes.length > 0) {
      for (const p of ponentes) {
        await connection.query(
          `INSERT INTO programa_conferencia_ponentes (conferencia_id, ponente_id, role, order_index) VALUES (?, ?, ?, ?)`,
          [conferenciaId, p.ponente_id, p.role || 'speaker', p.order_index || 0]
        );
      }
    }
    await connection.commit();
    revalidatePath('/[locale]/dashboard/programa', 'page');
    return { success: true, id: conferenciaId };
  } catch (error) {
    try { await connection.rollback(); } catch {}
    throw error;
  } finally {
    try { connection.release(); } catch {}
  }
}

export async function updateConferencia(id: number, data: { dia_id?: number; title: string; title_eng: string; description?: string; description_eng?: string; start_time: string; end_time: string; room?: string; type: string; capacity?: number; tags?: any[]; active?: number; ponentes?: Array<{ ponente_id: number; role?: string; order_index?: number }> }) {
  const { dia_id, title, title_eng, description, description_eng, start_time, end_time, room, type, capacity, tags, active, ponentes } = data as any;
  if (!title || !title_eng || !start_time || !end_time) return { success: false, error: 'Campos requeridos faltantes' };
  const connection = await (db as any).getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      `UPDATE programa_conferencias 
       SET dia_id = COALESCE(?, dia_id), title = ?, title_eng = ?, description = ?, description_eng = ?, start_time = ?, end_time = ?, room = ?, type = ?, capacity = ?, tags = ?, active = COALESCE(?, active)
       WHERE id = ?`,
      [dia_id || null, title, title_eng, description || null, description_eng || null, start_time, end_time, room || null, type || 'presentation', capacity || null, tags ? JSON.stringify(tags) : null, active ?? null, id]
    );
    if (Array.isArray(ponentes)) {
      await connection.query('DELETE FROM programa_conferencia_ponentes WHERE conferencia_id = ?', [id]);
      for (const p of ponentes) {
        await connection.query(
          `INSERT INTO programa_conferencia_ponentes (conferencia_id, ponente_id, role, order_index) VALUES (?, ?, ?, ?)`,
          [id, p.ponente_id, p.role || 'speaker', p.order_index || 0]
        );
      }
    }
    await connection.commit();
    revalidatePath('/[locale]/dashboard/programa', 'page');
    return { success: true };
  } catch (error) {
    try { await connection.rollback(); } catch {}
    throw error;
  } finally {
    try { connection.release(); } catch {}
  }
}

export async function deleteConferencia(id: number) {
  await db.query('UPDATE programa_conferencias SET active = 0 WHERE id = ?', [id]);
  revalidatePath('/[locale]/dashboard/programa', 'page');
  return { success: true };
}
