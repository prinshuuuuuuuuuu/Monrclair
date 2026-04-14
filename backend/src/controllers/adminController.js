const db = require('../config/db');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

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

    const [recentUsers] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE role = "user" ORDER BY created_at DESC LIMIT 5'
    );

    const [[{ pendingOrdersCount }]] = await db.query('SELECT COUNT(*) as pendingOrdersCount FROM orders WHERE status = "pending"');
    const [[{ cancelledOrdersCount }]] = await db.query('SELECT COUNT(*) as cancelledOrdersCount FROM orders WHERE status = "cancelled"');

    res.json({
      totalSales: totalSales || 0,
      totalOrders: totalOrders || 0,
      totalUsers: totalUsers || 0,
      pendingOrdersCount: pendingOrdersCount || 0,
      cancelledOrdersCount: cancelledOrdersCount || 0,
      recentUsers,
      recentOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { 
      status, 
      payment_status, 
      payment_method, 
      date_start, 
      date_end, 
      price_min, 
      price_max,
      search 
    } = req.query;

    let query = `
      SELECT o.*, u.name as customer, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ' AND o.status = ?';
      params.push(status);
    }
    if (payment_status && payment_status !== 'all') {
      query += ' AND o.payment_status = ?';
      params.push(payment_status);
    }
    if (payment_method && payment_method !== 'all') {
      query += ' AND o.payment_method = ?';
      params.push(payment_method);
    }
    if (date_start) {
      query += ' AND o.created_at >= ?';
      params.push(date_start);
    }
    if (date_end) {
      query += ' AND o.created_at <= ?';
      params.push(date_end + ' 23:59:59');
    }
    if (price_min) {
      query += ' AND o.total_amount >= ?';
      params.push(price_min);
    }
    if (price_max) {
      query += ' AND o.total_amount <= ?';
      params.push(price_max);
    }
    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ? OR o.id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY o.created_at DESC';

    const [orders] = await db.query(query, params);

    // Get stats for the header
    const [[stats]] = await db.query(`
      SELECT 
        COUNT(*) as totalOrders,
        COUNT(CASE WHEN status = "pending" THEN 1 END) as pendingOrders,
        COUNT(CASE WHEN status = "processing" THEN 1 END) as processingOrders,
        COUNT(CASE WHEN status = "cancelled" THEN 1 END) as cancelledOrders,
        COUNT(CASE WHEN status = "returned" THEN 1 END) as returnedOrders
      FROM orders
    `);

    res.json({ orders, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const [[order]] = await db.query(
      `SELECT o.*, u.name as customer_name, u.email, u.phone 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [items] = await db.query(
      `SELECT oi.*, p.name as product_name, p.image 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [order.id]
    );

    order.items = items;
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status, payment_status } = req.body;
  try {
    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (payment_status) {
      updates.push('payment_status = ?');
      params.push(payment_status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    params.push(req.params.id);
    await db.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role, is_blocked, last_login, created_at FROM users');
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

const getUserProfile = async (req, res) => {
  try {
    const [[user]] = await db.query(
      'SELECT id, name, email, role, phone, is_blocked, last_login, created_at FROM users WHERE id = ?', 
      [req.params.id]
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [orders] = await db.query(
      'SELECT id, total_amount, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );

    res.json({
      ...user,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createProduct = async (req, res) => {
  const { 
    name, brand, price, originalPrice, category, collection, 
    strapType, dialColor, description, featured, trending, 
    inStock, status, stock_quantity, 
    caseSize, movement, waterResistance, powerReserve, caseMaterial 
  } = req.body;

  try {
    let imageUrl = null;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => 
        cloudinary.uploader.upload(file.path, { folder: 'monrclair/products' })
      );
      const uploadResults = await Promise.all(uploadPromises);
      
      imageUrls = uploadResults.map(result => result.secure_url);
      imageUrl = imageUrls[0];

      req.files.forEach(file => fs.unlinkSync(file.path));
    }

    const sanitizeDecimal = (val) => (val === '' || val === undefined || val === null) ? null : val;

    const [result] = await db.query(
      `INSERT INTO products (
        name, brand, price, originalPrice, image, images, 
        category, collection, strapType, dialColor, description, 
        featured, trending, inStock, status, stock_quantity,
        caseSize, movement, waterResistance, powerReserve, caseMaterial
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, brand, sanitizeDecimal(price), sanitizeDecimal(originalPrice), 
        imageUrl, JSON.stringify(imageUrls), 
        category, collection, strapType, dialColor, description, 
        featured || 0, trending || 0, inStock || 1, status || 'active', stock_quantity || 0,
        caseSize, movement, waterResistance, powerReserve, caseMaterial
      ]
    );
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (error) {
    if (req.files) {
      req.files.forEach(file => { if (fs.existsSync(file.path)) fs.unlinkSync(file.path); });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const sanitizeDecimal = (val) => (val === '' || val === undefined || val === null) ? null : val;

  try {
    const fieldsToUpdate = [];
    const params = [];

    const possibleFields = [
      'name', 'brand', 'category', 'collection', 'strapType', 
      'dialColor', 'description', 'featured', 'trending', 
      'inStock', 'status', 'stock_quantity', 'caseSize', 
      'movement', 'waterResistance', 'powerReserve', 'caseMaterial'
    ];

    possibleFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate.push(`${field}=?`);
        params.push(req.body[field]);
      }
    });

    if (req.body.price !== undefined) {
      fieldsToUpdate.push(`price=?`);
      params.push(sanitizeDecimal(req.body.price));
    }
    
    if (req.body.originalPrice !== undefined) {
      fieldsToUpdate.push(`originalPrice=?`);
      params.push(sanitizeDecimal(req.body.originalPrice));
    }

    
    let imagesToSave = null;
    if (req.body.existingImages) {
      imagesToSave = JSON.parse(req.body.existingImages);
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => 
        cloudinary.uploader.upload(file.path, { folder: 'monrclair/products' })
      );
      const uploadResults = await Promise.all(uploadPromises);
      const newImageUrls = uploadResults.map(result => result.secure_url);
      
      if (imagesToSave === null) {
        imagesToSave = newImageUrls;
      } else {
        imagesToSave = [...imagesToSave, ...newImageUrls];
      }
      req.files.forEach(file => fs.unlinkSync(file.path));
    }

    if (imagesToSave !== null) {
      fieldsToUpdate.push(`images=?`);
      params.push(JSON.stringify(imagesToSave));
      
      if (imagesToSave.length > 0) {
        fieldsToUpdate.push(`image=?`);
        params.push(imagesToSave[0]);
      }
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const query = `UPDATE products SET ${fieldsToUpdate.join(', ')} WHERE id=?`;
    params.push(req.params.id);

    await db.query(query, params);
    res.json({ message: 'Product updated' });
  } catch (error) {
    if (req.files) {
      req.files.forEach(file => { if (fs.existsSync(file.path)) fs.unlinkSync(file.path); });
    }
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

const getAllProductsAdmin = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  getAllUsers,
  blockUser,
  deleteUser,
  getUserProfile,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin
};
