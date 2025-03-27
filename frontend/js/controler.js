// frontend/js/controler.js
// Ce fichier est EXCLUSIVEMENT pour le code du navigateur (client)
// Ne jamais utiliser require, module.exports, etc ici !

// frontend/js/controler.js
import { produits, Panier } from './model.js';
import { View } from './view.js';

fetch('/api/user')
  .then(res => res.json())
  .then(data => {
    const nav = document.getElementById('nav-connexion');
    const bienvenue = document.getElementById('bienvenue');

    if (data.isLoggedIn) {
      bienvenue.textContent = `Bienvenue, ${data.username}`;
      nav.innerHTML = `
        <a href="/deconnexion" class="connexion-btn" style="color: white; background-color: red; padding: 6px 12px; border-radius: 6px;">
          Déconnexion
        </a>
      `;
    }
  });

// Charger les articles au démarrage
window.addEventListener('DOMContentLoaded', () => {
  fetch('/api/articles')
    .then(res => res.json())
    .then(data => {
      produits.splice(0, produits.length, ...data); // on remplace tout le contenu de 'produits' par data
      View.afficherProduits(); // appelle la vue pour afficher
    })
    .catch(err => console.error('Erreur chargement articles:', err));

  // tu peux ensuite intercepter les clics sur "ajouter au panier", etc.
});


// Tu pourras ajouter ici des fonctions client pour le panier, etc.
