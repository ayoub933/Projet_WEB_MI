const db = require('./database');

async function getAllArticles() {
  const { rows } = await db.query('SELECT * FROM articles');
  return rows;
}

async function getArticleById(id) {
  const { rows } = await db.query('SELECT * FROM articles WHERE id = $1', [id]);
  return rows[0];
}

async function createArticle({ nom, prix, taille, couleur, lien_image }) {
  const { rows } = await db.query(
    'INSERT INTO articles (nom, prix, taille, couleur, lien_image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nom, prix, taille, couleur, lien_image]
  );
  return rows[0];
}

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle
};