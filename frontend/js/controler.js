// frontend/js/controler.js
import { produits, Panier } from './model.js';
import { View } from './view.js';

// Gère l'affichage du bouton Connexion/Déconnexion
fetch('/api/user')
  .then(res => res.json())
  .then(data => {
    const nav = document.getElementById('nav-connexion');
    const bienvenue = document.getElementById('bienvenue');
    if (data.isLoggedIn) {
      bienvenue.textContent = `Bienvenue, ${data.username} (Points : ${data.argent})`;
      nav.innerHTML = `
        <a href="/deconnexion" class="connexion-btn" style="color: white; background-color: red; padding: 6px 12px; border-radius: 6px;">
          Déconnexion
        </a>
      `;
    }
  });

// Au chargement de la page :
// 1) Charger les articles depuis /api/articles
// 2) Afficher les produits sur la page d'accueil (si id="produits" existe)
window.addEventListener('DOMContentLoaded', () => {
  // 1) Charger le panier depuis localStorage
  Panier.chargerLocal();

  // 2) Charger les articles
  fetch('/api/articles')
    .then(res => res.json())
    .then(data => {
      produits.splice(0, produits.length, ...data);
      // Si on trouve un élément #produits, on est sur accueil.html => afficherProduits()
      if (document.getElementById('produits')) {
        View.afficherProduits();
      }

      // Si on trouve un élément #liste-articles, on est sur article.html => afficherTousArticles()
      if (document.getElementById('liste-articles')) {
        View.afficherTousArticles();
      }
    })
    .catch(err => console.error('Erreur chargement articles:', err));

  // Gérer les clics
  document.body.addEventListener('click', (e) => {
    // Ajouter un article
    if (e.target.matches('.ajouter-panier')) {
      const id = parseInt(e.target.getAttribute('data-id'), 10);
      const article = produits.find(p => p.id === id);
      if (article) {
        Panier.ajouterProduit(article);
      }
    }
    // Supprimer
    if (e.target.matches('.supprimer-panier')) {
      const index = parseInt(e.target.getAttribute('data-index'), 10);
      Panier.supprimerProduit(index);
      View.afficherPanier();
    }
    // Vider
    if (e.target.matches('#vider-panier')) {
      Panier.viderPanier();
      View.afficherPanier();
    }
    // Valider le panier
  if (e.target.matches('#valider-panier')) {
    // 1) Calculer le total (via Panier.getPanier() ou View, etc.)
    const panier = Panier.getPanier();
    let total = 0;
    panier.forEach(p => total += parseFloat(p.prix));
    total = parseFloat(total.toFixed(2));

    // 2) Faire un fetch POST vers /api/checkout
    fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ total })  // On envoie le total
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(`Achat validé ! Il vous reste ${data.argent} €.`);
        // On peut vider le panier local si on veut
        Panier.viderPanier();
        View.afficherPanier();
      } else {
        alert(data.error || 'Une erreur est survenue.');
      }
    })
    .catch(err => {
      console.error('Erreur lors du checkout:', err);
      alert('Erreur serveur.');
    });
  }
  });
});