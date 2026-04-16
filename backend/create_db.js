const mysql = require('mysql2/promise');
require('dotenv').config();

async function init() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306
  });

  try {
    const dbName = process.env.DB_NAME || 'Montclair';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database \`${dbName}\` created or already exists.`);
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await connection.end();
  }
}

init();
