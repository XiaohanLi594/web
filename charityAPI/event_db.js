const mysql = require('mysql2/promise');
const dbConfig = require('./db-details.js'); 

const pool = mysql.createPool({
  host: dbConfig.host,        
  user: dbConfig.user,         
  password: dbConfig.password, 
  database: dbConfig.database, 
  connectionLimit: 10         
});

module.exports = pool;