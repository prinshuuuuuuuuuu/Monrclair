const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function applySchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    const schemaPath = path.join(__dirname, 'unified_montclair.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying schema...');
    await connection.query(sql);
    console.log('Schema applied successfully.');
  } catch (err) {
    console.error('Error applying schema:', err);
  } finally {
    await connection.end();
  }
}

applySchema();
