// src/db.js
import mysql from "mysql2";

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'team_project_management'
}).promise();

export async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the database successfully!");
    connection.release();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
}

export default pool;
