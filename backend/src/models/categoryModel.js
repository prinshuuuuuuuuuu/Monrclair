const db = require('../config/db');

const Category = {
  findAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM categories ORDER BY id ASC');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  findById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  findByName: async (name) => {
    try {
      const [rows] = await db.query('SELECT * FROM categories WHERE name = ?', [name]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  create: async (categoryData) => {
    try {
      const { name, status } = categoryData;
      const [result] = await db.query(
        'INSERT INTO categories (name, status) VALUES (?, ?)',
        [name, status || 'active']
      );
      return { id: result.insertId, ...categoryData };
    } catch (error) {
      throw error;
    }
  },

  update: async (id, categoryData) => {
    try {
      const { name, status } = categoryData;
      await db.query(
        'UPDATE categories SET name = ?, status = ? WHERE id = ?',
        [name, status, id]
      );
      return { id, ...categoryData };
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await db.query('DELETE FROM categories WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  getStats: async () => {
    try {
      const [total] = await db.query('SELECT COUNT(*) as count FROM categories');
      const [active] = await db.query("SELECT COUNT(*) as count FROM categories WHERE status = 'active'");
      const [inactive] = await db.query("SELECT COUNT(*) as count FROM categories WHERE status = 'inactive'");
      
      return {
        total: total[0].count,
        active: active[0].count,
        inactive: inactive[0].count
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Category;
