// frontend/js/controler.js
// Ce fichier est EXCLUSIVEMENT pour le code du navigateur (client)
// Ne jamais utiliser require, module.exports, etc ici !

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

// Tu pourras ajouter ici des fonctions client pour le panier, etc.
