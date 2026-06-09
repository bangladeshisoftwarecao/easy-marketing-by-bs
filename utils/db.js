const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 't',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('connection', (connection) => {
  console.log(`connection established`);
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Connection failed! Error code:', err.code);
    console.error('Error details:', err.message);
    return;
  }
  console.log('connection successful. database is ready.');
  connection.release();
});

module.exports = pool.promise();
