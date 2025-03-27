// database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'web',
  password: 'pweb',
  port: 5432,
});

module.exports = pool;
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Erreur lors de la connexion à la base de données', err.stack);
    } else {
      console.log('Connexion à la base de données réussie', res.rows[0]);
    }
  });