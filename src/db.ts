import mysql, {Pool} from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 10,
});

export const initDatabase = async (): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL
      )
    `);
    console.log('Database initialized successfully');
  } finally {
    connection.release();
  }
};

export default pool;
