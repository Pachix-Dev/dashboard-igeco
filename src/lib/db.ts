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

export const roles = {
    admin: ['/dashboard', '/dashboard/usuarios', '/dashboard/exhibitors', '/dashboard/scan-leads'],
    exhibitor: ['/dashboard', '/dashboard/exhibitors'],    
};

export async function fetchUsers(): Promise<User[]> {
    try{
        const [rows] = await db.query('SELECT * FROM users');
        return rows as User[];
    } catch (error) {
        console.error('Database Error: ', error);
        throw new Error('Error fetching users');
    }
}

export async function fetchExhibitors(): Promise<Exhibitor[]> {
    try{
        const [rows] = await db.query('SELECT * FROM exhibitors');
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
        const [rows] = await db.query(
            'SELECT * FROM leads l LEFT JOIN records r ON l.record_id = r.id WHERE l.user_id = ?',
            [userId]
        );
        
        return rows as Lead[];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Error fetching user records');
    }
}
