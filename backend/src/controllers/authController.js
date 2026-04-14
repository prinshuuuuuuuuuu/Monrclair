const db = require('../config/db');
const User = require('../models/userModel');
const Address = require('../models/addressModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userId = await User.create(name, email, password);
    res.status(201).json({
      id: userId,
      name,
      email,
      token: generateToken(userId),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check .env Admin Override First
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return res.json({
        id: 'admin-env-id',
        name: 'System Administrator',
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        token: generateToken('admin-env-id'),
      });
    }

    // Otherwise check normal database users
    const user = await User.findByEmail(email);
    if (user && password === user.password) {
      if (user.is_blocked) {
        return res.status(403).json({ message: 'This account has been suspended' });
      }
      
      // Update last login
      await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getMe = async (req, res) => {
  try {
    if (req.user.id === 'admin-env-id') {
      return res.json(req.user);
    }
    const user = await User.findById(req.user.id);
    const addresses = await Address.findByUserId(req.user.id);
    res.json({ ...user, addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    await User.update(req.user.id, req.body);
    const updatedUser = await User.findById(req.user.id);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const fullUser = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    
    // In a real app, use bcrypt. Here we follow the simple direct comparison used in login
    if (fullUser[0][0].password !== currentPassword) {
      return res.status(400).json({ message: 'Current password incorrect' });
    }

    await User.updatePassword(req.user.id, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Address Management
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findByUserId(req.user.id);
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const addressId = await Address.create(req.user.id, req.body);
    res.status(201).json({ id: addressId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await Address.delete(req.params.id, req.user.id);
    res.json({ message: 'Address removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setDefaultAddress = async (req, res) => {
  try {
    await Address.setDefault(req.params.id, req.user.id);
    res.json({ message: 'Default address updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  changePassword,
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress
};

