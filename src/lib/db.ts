import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true
})

import { Boletos } from './definitions'

export async function getBoletos() {
    const connection = await pool.getConnection()
    const [rows] = await connection.query("SELECT u.id, u.name, IFNULL(u.email, '') AS email,   IFNULL(u.phone, '') AS phone, u.created_at, IFNULL(o.paypal_id_transaction, '') AS paypal_id_transaction, IFNULL(o.total, '') AS total FROM users u LEFT JOIN orders o ON u.id = o.user_id;")
    connection.release()
    return rows as Boletos[];
}