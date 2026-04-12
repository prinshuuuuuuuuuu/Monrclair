const db = require('../config/db');

const Address = {
  create: async (userId, data) => {
    const { fullName, street, city, state, zip, country, phone, isDefault } = data;
    
    // If setting as default, unset others first
    if (isDefault) {
      await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
    }

    const [result] = await db.query(
      'INSERT INTO addresses (user_id, full_name, street, city, state, zip, country, phone, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, fullName, street, city, state, zip, country, phone, isDefault]
    );
    return result.insertId;
  },

  findByUserId: async (userId) => {
    const [rows] = await db.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC', [userId]);
    return rows;
  },

  delete: async (id, userId) => {
    await db.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, userId]);
  },

  setDefault: async (id, userId) => {
    await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
    await db.query('UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?', [id, userId]);
  }
};

module.exports = Address;
