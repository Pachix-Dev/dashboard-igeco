import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import db from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await db.query(
      `SELECT name, position, company, bio_esp, bio_eng, photo, impresiones, estatus, created_at
       FROM ponentes
       WHERE estatus = 1
       ORDER BY name ASC`
    );

    const exportRows = rows.map((item: any) => ({
      Nombre: String(item.name ?? '').trim().split(/\s+/).slice(0, -1).join(' ') || item.name || '',
      Apellido: String(item.name ?? '').trim().split(/\s+/).slice(-1).join(' ') || '',
      Correo: '',
      Empresa: item.company ?? '',
      'Tema / Cargo': item.position ?? '',
      'Bio Español': item.bio_esp ?? '',
      'Bio Inglés': item.bio_eng ?? '',
      Foto: item.photo ?? '',
      Impresiones: item.impresiones ?? 0,
      Estatus: item.estatus === 1 ? 'Activo' : 'Inactivo',
      Creado: item.created_at ? new Date(item.created_at).toISOString().slice(0, 19).replace('T', ' ') : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet['!cols'] = [
      { wch: 28 },
      { wch: 24 },
      { wch: 28 },
      { wch: 42 },
      { wch: 42 },
      { wch: 26 },
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ponentes activos');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="ponentes-activos.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error exporting ponentes:', error);
    return NextResponse.json({ message: 'Error al exportar ponentes' }, { status: 500 });
  }
}