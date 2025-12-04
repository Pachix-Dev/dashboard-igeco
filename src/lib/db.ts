import mysql from 'mysql2/promise';
import { User, Exhibitor, Lead, Ponentes, Escenarios, Dia } from './definitions';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 100, // Máximo 10 conexiones simultáneas
    waitForConnections: true, // Esperar si no hay conexiones disponibles
    queueLimit: 0, // Sin límite de cola
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10000, // 10 segundos para conectar
});

export default db;

const db_re_eco = mysql.createPool({
    host: process.env.DB_HOST2,
    user: process.env.DB_USER2,
    password: process.env.DB_PASSWORD2,
    database: process.env.DB_NAME2,
    connectionLimit: 100,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10000,
});

export {db_re_eco};

export const roles = {
    admin: ['/dashboard', '/dashboard/usuarios', '/dashboard/exhibitors', '/dashboard/profile', '/dashboard/scan-leads', '/dashboard/session-limit', '/dashboard/ponentes', '/dashboard/programa'],
    editor: ['/dashboard', '/dashboard/profile', '/dashboard/session-limit', '/dashboard/ponentes', '/dashboard/programa'],
    exhibitor: ['/dashboard', '/dashboard/profile', '/dashboard/exhibitors', '/dashboard/scan-leads', '/dashboard/session-limit'],    
};

export async function fetchUsers(): Promise<User[]> {    
    try{
        const [rows] = await db.query('SELECT * FROM users WHERE role != "admin"');
        return rows as User[];
    } catch (error) {
        console.error('Database Error: ', error);
        throw new Error('Error fetching users');
    }
}

export async function fetchEscenarios(): Promise<Escenarios[]> {    
    try {
        const [rows] = await db.query('SELECT * FROM escenarios');
        return rows as Escenarios[];
    } catch (error) {
        console.error('Database Error: ', error);
        throw new Error('Error fetching escenarios');
    }
}

export async function fetchDias(): Promise<Dia[]> {    
    try {
        const [rows] = await db.query('SELECT * FROM dias');
        return rows as Dia[];
    } catch (error) {
        console.error('Database Error: ', error);
        throw new Error('Error fetching escenarios');
    }
}

// Versión específica para el módulo Programa con tipos compatibles
import type { Escenario as ProgramaEscenario, ProgramaDia as ProgramaDiaType } from '@/types/programa'

export async function fetchProgramaEscenarios(): Promise<ProgramaEscenario[]> {
    try {
        const [rows] = await db.query<any[]>(
            'SELECT id, name, description, location, capacity, active, created_at, updated_at FROM escenarios'
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
        })) as ProgramaEscenario[];
    } catch (error) {
        console.error('Database Error: ', error);
        throw new Error('Error fetching programa escenarios');
    }
}

export async function fetchProgramaDias(escenarioId?: number): Promise<ProgramaDiaType[]> {
    try {
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
    } catch (error) {
        console.error('Database Error: ', error);
        throw new Error('Error fetching programa dias');
    }
}

interface JWTPayload {
  id: number;
  email: string;
  role: string;
  maxsessions: number;
}

export async function fetchExhibitors(): Promise<Exhibitor[]> {  
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value; 
    if (!token) {
        throw new Error('No access token found');
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!secret || !process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    const {payload} = await jwtVerify(token, secret) as { payload: JWTPayload };
    const userId = payload.id;
    try {
        const query = payload.role === 'admin' 
            ? 'SELECT * FROM exhibitors' 
            : 'SELECT * FROM exhibitors WHERE user_id = ?';    
        const params = payload.role === 'admin' ? [] : [userId];
        const [rows] = await db.query(query, params);
    
        return rows as Exhibitor[];
    } catch (error) {
        console.error('Database Error: ', error);
        throw new Error('Error fetching exhibitors');
    }
    
}

export async function fetchPonenetes(): Promise<Ponentes[]> {        
    try {
        // Asegúrate de que la consulta esté completa, especificando de dónde obtener los datos.
        const query = 
        'SELECT s.id, s.uuid, s.name AS speaker_name, s.position, s.company, s.bio_esp, s.bio_eng, s.photo, s.impresiones ' + 
        'FROM ponentes s';  // Aquí especificamos la tabla 'ponentes' de la que obtener los datos.
        
        // Ejecutamos la consulta a la base de datos.
        const [rows] = await db.query(query);
        
        // Devolvemos los resultados como un arreglo de Ponentes.
        return rows as Ponentes[];
    } catch (error) {
        // Se recomienda agregar más detalles en el error para facilitar el diagnóstico.
        console.error('Database Error: ', error);
        throw new Error('Error fetching ponentes');  // Asegúrate de que el mensaje sea coherente con los datos que estás obteniendo.
    }
}

export async function fetchRecordsByUserId(): Promise<Lead[]> {
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) {
        throw new Error('No access token found');
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!secret || !process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayload };
    const userId = payload.id;
    try {

        const [rows]: [any[], any] = await db.query(
            'SELECT uuid, notes FROM leads WHERE user_id = ?',
            [userId]
        );

        // Extract user IDs from the leads table
        const recordIds = rows.map((row) => row.uuid); // Ensure correct field is used

        // If no record IDs, return early to prevent SQL errors
        if (recordIds.length === 0) return [];

        // Validate UUID format for security
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const validRecordIds = recordIds.filter((uuid: string) => 
            typeof uuid === 'string' && uuid.length <= 36 && uuidRegex.test(uuid)
        );

        if (validRecordIds.length === 0) return [];

        // Limit to prevent abuse (max 100 UUIDs)
        const limitedRecordIds = validRecordIds.slice(0, 100);

        const placeholders = limitedRecordIds.map(() => '?').join(',');

        // Fetch from `users` table
        const [users]: [any[], any] = await db_re_eco.query(
            `SELECT * FROM users_2026 WHERE uuid IN (${placeholders})`,
            limitedRecordIds
        );

        // Fetch from `users_ecomondo` table
        const [usersEcomondo]: [any[], any] = await db_re_eco.query(
            `SELECT * FROM users_ecomondo_2026 WHERE uuid IN (${placeholders})`,
            limitedRecordIds
        );

        const [usersExhibitors]: [any[], any] = await db.query(
            `SELECT * FROM exhibitors WHERE uuid IN (${placeholders})`,
            limitedRecordIds
        );

        // Merge both results into one array
        const records = [...users, ...usersEcomondo, ...usersExhibitors];

        // Add notes to the records
        const recordsWithNotes = records.map(record => {
            const lead = rows.find(row => row.uuid === record.uuid);
            return { ...record, notes: lead?.notes };
        });

        return recordsWithNotes as Lead[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Error fetching user records');
    }
}
