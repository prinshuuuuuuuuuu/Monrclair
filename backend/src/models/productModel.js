const db = require("../config/db");

const Product = {
  findAll: async (includeInactive = false) => {
    try {
      let query = "SELECT * FROM products";
      if (!includeInactive) {
        query += " WHERE status = 'active'";
      }
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  findById: async (id) => {
    try {
      const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
        id,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Product;
