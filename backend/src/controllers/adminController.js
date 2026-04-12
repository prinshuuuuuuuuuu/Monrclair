const db = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalSales }]] = await db.query('SELECT SUM(total_amount) as totalSales FROM orders WHERE status != "refunded"');
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) as totalOrders FROM orders');
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users WHERE role = "user"');
    const [recentOrders] = await db.query(
      'SELECT o.*, u.name as customer FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5'
    );
    const [topProducts] = await db.query(
      'SELECT p.name, SUM(oi.quantity) as sold FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.id ORDER BY sold DESC LIMIT 5'
    );

    res.json({
      totalSales: totalSales || 0,
      totalOrders: totalOrders || 0,
      totalUsers: totalUsers || 0,
      recentOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT o.*, u.name as customer, u.email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role, is_blocked, created_at FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  const { is_blocked } = req.body;
  try {
    await db.query('UPDATE users SET is_blocked = ? WHERE id = ?', [is_blocked, req.params.id]);
    res.json({ message: `User ${is_blocked ? 'blocked' : 'unblocked'}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  const { name, brand, price, originalPrice, category, collection, strapType, dialColor, description, featured, trending, inStock, caseSize, movement, waterResistance, powerReserve, caseMaterial } = req.body;
  const image = req.files && req.files.length > 0 ? `/uploads/${req.files[0].filename}` : null;
  const images = req.files ? JSON.stringify(req.files.map(f => `/uploads/${f.filename}`)) : '[]';

  const sanitizeDecimal = (val) => (val === '' || val === undefined || val === null) ? null : val;

  try {
    const [result] = await db.query(
      `INSERT INTO products (name, brand, price, originalPrice, image, images, category, collection, strapType, dialColor, description, featured, trending, inStock, caseSize, movement, waterResistance, powerReserve, caseMaterial) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, brand, sanitizeDecimal(price), sanitizeDecimal(originalPrice), image, images, category, collection, strapType, dialColor, description, featured || 0, trending || 0, inStock || 1, caseSize, movement, waterResistance, powerReserve, caseMaterial]
    );
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, brand, price, originalPrice, category, collection, strapType, dialColor, description, featured, trending, inStock, caseSize, movement, waterResistance, powerReserve, caseMaterial } = req.body;
  
  const sanitizeDecimal = (val) => (val === '' || val === undefined || val === null) ? null : val;

  try {
    let query = `UPDATE products SET name=?, brand=?, price=?, originalPrice=?, category=?, collection=?, strapType=?, dialColor=?, description=?, featured=?, trending=?, inStock=?, caseSize=?, movement=?, waterResistance=?, powerReserve=?, caseMaterial=?`;
    let params = [name, brand, sanitizeDecimal(price), sanitizeDecimal(originalPrice), category, collection, strapType, dialColor, description, featured, trending, inStock, caseSize, movement, waterResistance, powerReserve, caseMaterial];

    if (req.files && req.files.length > 0) {
      const image = `/uploads/${req.files[0].filename}`;
      const images = JSON.stringify(req.files.map(f => `/uploads/${f.filename}`));
      query += `, image=?, images=?`;
      params.push(image, images);
    }

    query += ` WHERE id=?`;
    params.push(req.params.id);

    await db.query(query, params);
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  blockUser,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct
};
