import mysql from 'mysql2/promise';
import { User } from './definitions';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export default db;

export async function fetchUsers(): Promise<User[]> {
    try{
        const [rows] = await db.query('SELECT * FROM users');
        return rows as User[];
    } catch (error) {
        console.error('Database Error: ', error);
        throw new Error('Error fetching users');
    }
}