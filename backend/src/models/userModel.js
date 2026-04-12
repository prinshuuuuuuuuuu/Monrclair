const db = require('../config/db');

const User = {
  create: async (name, email, password) => {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return result.insertId;
  },


  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
    return rows[0];
  }

};

module.exports = User;
