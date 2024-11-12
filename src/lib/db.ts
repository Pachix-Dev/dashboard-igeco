import mysql from 'mysql2/promise';
import { User, Exhibitor } from './definitions';

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