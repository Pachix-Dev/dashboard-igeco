import mysql from 'mysql2/promise';
import { User, Exhibitor, Lead, Ponentes, Escenarios, Dia } from './definitions';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';



const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export default db;

const db_re_eco = mysql.createPool({
    host: process.env.DB_HOST2,
    user: process.env.DB_USER2,
    password: process.env.DB_PASSWORD2,
    database: process.env.DB_NAME2
});

export {db_re_eco};

export const roles = {
    admin: ['/dashboard', '/dashboard/usuarios', '/dashboard/exhibitors', '/dashboard/profile', '/dashboard/scan-leads', '/dashboard/ponentes', '/dashboard/programa'],
    exhibitor: ['/dashboard', '/dashboard/profile', '/dashboard/exhibitors'],
    exhibitorplus: ['/dashboard', '/dashboard/profile', '/dashboard/exhibitors', '/dashboard/scan-leads'],    
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

export async function fetchExhibitors(): Promise<Exhibitor[]> {  
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value; 
    if (!token) {
        throw new Error('No access token found');
    } 
    const {payload} = await jwtVerify(token, new TextEncoder().encode("tu_secreto_jwt"));
    const userId = payload.id;
    try {
        const query = payload.role === 'admin' 
            ? 'SELECT e.*, u.name AS company FROM exhibitors e LEFT JOIN users u ON e.user_id = u.id' 
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
    const { payload } = await jwtVerify(token, new TextEncoder().encode("tu_secreto_jwt"));
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

        const placeholders = recordIds.map(() => '?').join(',');

        // Fetch from `users` table
        const [users]: [any[], any] = await db_re_eco.query(
            `SELECT * FROM users WHERE uuid IN (${placeholders})`,
            recordIds
        );

        // Fetch from `users_ecomondo` table
        const [usersEcomondo]: [any[], any] = await db_re_eco.query(
            `SELECT * FROM users_ecomondo WHERE uuid IN (${placeholders})`,
            recordIds
        );

        // Merge both results into one array
        const records = [...users, ...usersEcomondo];

        // Add notes to the records
        const recordsWithNotes = records.map(record => {
            const lead = rows.find(row => row.uuid === record.uuid);
            return { ...record, notes: lead?.notes };
        });

        console.log('Records:', recordsWithNotes);
        return recordsWithNotes as Lead[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Error fetching user records');
    }
}
