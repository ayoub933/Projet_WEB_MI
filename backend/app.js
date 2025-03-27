// backend/app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const controller = require('./serverController'); // Note : pas de ../frontend/js/controler

const app = express();

// Pour parser les données du formulaire
app.use(express.urlencoded({ extended: false }));

// Servir les fichiers statiques depuis le dossier frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Configuration de la session
app.use(session({
  secret: 'secret', // à sécuriser en production
  resave: false,
  saveUninitialized: true
}));

// Routes
app.get('/connexion', controller.loginGet);
app.post('/connexion', controller.loginPost);

// Route d'accueil (pour l'exemple)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/accueil.html'));
});

app.get('/deconnexion', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/connexion');
  });
});

app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({
      isLoggedIn: true,
      username: req.session.user.nom,
      role: req.session.user.roles // si tu veux afficher le rôle plus tard
    });
  } else {
    res.json({ isLoggedIn: false });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
