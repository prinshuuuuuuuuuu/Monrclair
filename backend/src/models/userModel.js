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
    const [rows] = await db.query('SELECT id, name, email, role, phone, is_blocked FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, data) => {
    const { name, phone } = data;
    await db.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, id]);
  },

  updatePassword: async (id, password) => {
    await db.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
  }
};

module.exports = User;
