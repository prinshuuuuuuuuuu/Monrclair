const User = require('../models/userModel');
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
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };

