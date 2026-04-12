const db = require('../config/db');

const Product = {
  // Get all products from database
  findAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM products');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get single product by ID
  findById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Product;
