// frontend/js/model.js

export let produits = []; // Rempli via fetch('/api/articles')

export const Panier = {
  panier: [],

  // Lire le panier depuis localStorage
  chargerLocal() {
    try {
      const data = localStorage.getItem('monPanier');
      this.panier = data ? JSON.parse(data) : [];
    } catch (err) {
      this.panier = [];
    }
  },

  // Sauvegarder le panier dans localStorage
  sauvegarderLocal() {
    localStorage.setItem('monPanier', JSON.stringify(this.panier));
  },

  getPanier() {
    return this.panier;
  },

  ajouterProduit(produit) {
    this.panier.push(produit);
    this.sauvegarderLocal();
  },

  supprimerProduit(index) {
    this.panier.splice(index, 1);
    this.sauvegarderLocal();
  },

  viderPanier() {
    this.panier = [];
    this.sauvegarderLocal();
  }
};
