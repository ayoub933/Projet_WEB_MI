// backend/model.js
const db = require('../../backend/database');
const bcrypt = require('bcrypt');

const findUserByUsername = async (username) => {
  const { rows } = await db.query('SELECT * FROM utilisateurs WHERE nom = $1', [username]);
  return rows[0];
};

const comparePassword = async (plainPassword, hash) => {
  return await bcrypt.compare(plainPassword, hash);
};

module.exports = {
  findUserByUsername,
  comparePassword
};
