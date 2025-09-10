const db = require('../db');
const bcrypt = require('bcryptjs');

const User = {
  create: async (userData) => {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const sql = 'INSERT INTO User (username, email, password, roleId) VALUES (?, ?, ?, ?)';
      const [result] = await db.query(sql, [userData.username, userData.email, hashedPassword, userData.roleId]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  findByEmail: async (email) => {
    try {
      const sql = 'SELECT * FROM User WHERE email = ?';
      const [results] = await db.query(sql, [email]);
      return results[0];
    } catch (error) {
      throw error;
    }
  },

  emailExists: async (email) => {
    try {
      const sql = 'SELECT COUNT(*) as count FROM User WHERE email = ?';
      const [results] = await db.query(sql, [email]);
      return results[0].count > 0;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const sql = 'SELECT * FROM User';
      const [results] = await db.query(sql);
      return results;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = User;
