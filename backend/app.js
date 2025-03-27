// ==================== backend/app.js ====================
// Fichier principal du serveur Express

const express = require('express');
const session = require('express-session');
const path = require('path');
const controller = require('./serverController');
const db = require('./database');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // important pour lire le JSON dans req.body

app.use(express.static(path.join(__dirname, '../frontend')));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Auth
app.get('/connexion', controller.loginGet);
app.post('/connexion', controller.loginPost);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/accueil.html'));
});

app.get('/deconnexion', (req, res) => {
  req.session.destroy(() => res.redirect('/connexion'));
});

// Routes Articles
app.get('/api/articles', controller.getArticles);
app.get('/api/articles/:id', controller.getArticleById);
app.post('/api/articles', controller.createArticle);

// Route /api/user pour la session
app.get('/api/user', async (req, res) => {
  if (!req.session.user) {
    return res.json({ isLoggedIn: false });
  }

  // Récupérer l'utilisateur depuis la DB pour avoir la dernière valeur d'argent
  const { rows } = await db.query('SELECT id, nom, argent, roles FROM utilisateurs WHERE id = $1', [req.session.user.id]);
  const user = rows[0];
  if (!user) {
    return res.json({ isLoggedIn: false });
  }

  res.json({
    isLoggedIn: true,
    username: user.nom,
    argent: user.argent,
    role: user.roles
  });
});

// Exemple d'une route POST /api/checkout
app.post('/api/checkout', async (req, res) => {
  try {
    // 1) Vérifier la session de l'utilisateur
    if (!req.session.user) {
      return res.status(401).json({ error: 'Vous devez être connecté pour valider le panier.' });
    }

    // 2) Récupérer les infos de l'utilisateur depuis la DB (argent, id, etc.)
    const { rows } = await db.query(
      'SELECT id, argent FROM utilisateurs WHERE id = $1',
      [req.session.user.id]
    );
    const utilisateur = rows[0];
    if (!utilisateur) {
      return res.status(401).json({ error: 'Utilisateur introuvable.' });
    }

    // 3) Récupérer le total envoyé par le frontend
    const { total } = req.body;
    if (typeof total !== 'number') {
      return res.status(400).json({ error: 'Total invalide.' });
    }

    // 4) Vérifier si l'utilisateur a assez d'argent
    if (utilisateur.argent < total) {
      return res.status(400).json({ error: 'Fonds insuffisants.' });
    }

    // 5) Mettre à jour l'argent de l'utilisateur dans la DB
    const argentRestant = utilisateur.argent - total;
    await db.query(
      'UPDATE utilisateurs SET argent = $1 WHERE id = $2',
      [argentRestant, utilisateur.id]
    );

    // 6) (Optionnel) Vider le panier côté serveur si tu gères un panier en DB

    // 7) Répondre avec un message de succès
    res.json({
      success: true,
      message: `Achat validé ! Il vous reste ${argentRestant} €.`,
      argent: argentRestant
    });

  } catch (err) {
    console.error('Erreur /api/checkout :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});