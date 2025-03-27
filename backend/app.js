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

// 🔥 Routes Articles
app.get('/api/articles', controller.getArticles);
app.get('/api/articles/:id', controller.getArticleById);
app.post('/api/articles', controller.createArticle);

// Route /api/user pour la session
app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({
      isLoggedIn: true,
      username: req.session.user.nom,
      role: req.session.user.roles
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
