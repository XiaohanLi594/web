require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,     
  queueLimit: 0      
};

const pool = mysql.createPool(dbConfig);

async function connectDB() 
{
  try 
  {
    const connection = await pool.getConnection();
    console.log('Get successful connection from the connection pool');
    return connection;
  } catch (err) 
  {
    console.error('Connection pool failed to obtain connection:', err.message);
    throw new Error('Failed to get connection from pool');
  }
}

module.exports = connectDB;