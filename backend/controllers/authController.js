const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password, roleId } = req.body;
      await User.create({ username, email, password, roleId });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      
      const token = jwt.sign({ id: user.id, role: user.roleId }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  validateAdminCode: async (req, res) => {
    try {
      const { adminCode } = req.body;
      if (adminCode !== '12345') {
        return res.status(400).json({ message: 'Invalid admin code' });
      }
      res.json({ message: 'Admin code validated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, email, roleId } = req.body;

      await User.findByIdAndUpdate(userId, { username, email, roleId });
      res.json({ message: 'User updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      await User.findByIdAndDelete(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },



  
};

module.exports = authController;
