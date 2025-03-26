const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const { name, email, password, role } = userData;
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, password, role || 'student'], callback);
  },

  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], callback);
  },

  updateRole: (userId, role, callback) => {
    const query = 'UPDATE users SET role = ? WHERE id = ?';
    db.query(query, [role, userId], callback);
  },
};

module.exports = User;