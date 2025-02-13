import mysql from 'mysql2/promise';
import { User, Exhibitor, Lead } from './definitions';
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
    admin: ['/dashboard', '/dashboard/usuarios', '/dashboard/exhibitors', '/dashboard/profile', '/dashboard/scan-leads'],
    exhibitor: ['/dashboard', '/dashboard/exhibitors', '/dashboard/profile'],
    exhibitorplus: ['/dashboard','/dashboard/exhibitors', '/dashboard/profile', '/dashboard/scan-leads'],    
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

export async function fetchExhibitors(): Promise<Exhibitor[]> {  
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value; 
    if (!token) {
        throw new Error('No access token found');
    } 
    const {payload} = await jwtVerify(token, new TextEncoder().encode("tu_secreto_jwt"));

    const userId = payload.id;  
    try{
        const [rows] = await db.query('SELECT * FROM exhibitors WHERE user_id = ?', [userId]);
        return rows as Exhibitor[];
    } catch (error) {
        console.error('Database Error: ', error);
        throw new Error('Error fetching users');
    }
}

export async function fetchRecordsByUserId(): Promise<Lead[]> {    
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) {
        throw new Error('No access token found');
    }
    const {payload} = await jwtVerify(token, new TextEncoder().encode("tu_secreto_jwt"));
    const userId = payload.id;       
    try {       

        const [rows]: [any[], any] = await db.query(
            'SELECT * FROM leads WHERE user_id = ?',
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
        console.log('Records:', records);
        return records as Lead[];
        
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Error fetching user records');
    }
}
