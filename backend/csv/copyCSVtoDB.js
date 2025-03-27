const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const db = require('../database.js');
const saltRounds = 10;

// Utilise __dirname pour construire le chemin complet vers les fichiers CSV
fs.createReadStream(path.join(__dirname, 'utilisateurs.csv'))
  .pipe(csv())
  .on('data', (row) => {
    // Hachage du mot de passe avant insertion
    bcrypt.hash(row.mot_de_passe, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('Erreur lors du hachage du mot de passe:', err);
        return;
      }
      // Préparation de la requête d'insertion
      const query = 'INSERT INTO utilisateurs (nom, mot_de_passe, argent, roles, date_naissance) VALUES ($1, $2, $3, $4, $5)';
      const values = [row.nom, hashedPassword, parseInt(row.argent, 10), parseInt(row.roles, 10), row.date_naissance];
      db.query(query, values);
    });
  })
  .on('end', () => {
    console.log('Utilisateurs importés avec succès');
  });

// Fonction pour importer les articles
function importArticles() {
  fs.createReadStream(path.join(__dirname, 'articles.csv'))
    .pipe(csv())
    .on('data', (row) => {
      // Correction de la requête : on a 5 colonnes et 5 valeurs
      const query = 'INSERT INTO Articles (nom, prix, taille, couleur, lien_image) VALUES ($1, $2, $3, $4, $5)';
      const values = [row.nom, parseFloat(row.prix, 10), row.taille, row.couleur, row.lien_image];
      db.query(query, values);
    })
    .on('end', () => {
      console.log('Articles importés avec succès');
    });
}

importArticles();
