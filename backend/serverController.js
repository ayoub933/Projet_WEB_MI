// backend/serverController.js
const db = require('./database');
const bcrypt = require('bcrypt');

const loginGet = (req, res) => {
  // Tu peux renvoyer une page HTML statique ou utiliser un moteur de vues
  res.sendFile(require('path').join(__dirname, '../frontend/connexion.html'));
};

const loginPost = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // Remplace cette logique par celle qui convient à ton projet (par exemple, en consultant ta base)
    const { rows } = await db.query('SELECT * FROM utilisateurs WHERE nom = $1', [username]);
    const user = rows[0];
    if (!user) {
      return res.redirect('/connexion?error=Utilisateur non trouvé');
    }
    const match = await bcrypt.compare(password, user.mot_de_passe);
    if (!match) {
      return res.redirect('/connexion?error=Mot de passe incorrect');
    }
    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

// backend/serverController.js
const articleModel = require('./articleModel');

// Route pour récupérer tous les articles
async function getArticles(req, res) {
  try {
    const articles = await articleModel.getAllArticles();
    res.json(articles); // Renvoie la liste au format JSON
  } catch (err) {
    console.error('Erreur getArticles:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Route pour récupérer un article par ID
async function getArticleById(req, res) {
  const { id } = req.params;
  try {
    const article = await articleModel.getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
    res.json(article);
  } catch (err) {
    console.error('Erreur getArticleById:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Route pour créer un article (ex: POST /api/articles)
async function createArticle(req, res) {
  try {
    const { nom, prix, taille, couleur, lien_image } = req.body;
    // Vérifications basiques
    if (!nom || !prix || !lien_image) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }
    const newArticle = await articleModel.createArticle({
      nom,
      prix,
      taille,
      couleur,
      lien_image
    });
    res.json(newArticle);
  } catch (err) {
    console.error('Erreur createArticle:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  // Auth
  loginGet,
  loginPost,
  // Articles
  getArticles,
  getArticleById,
  createArticle,
};