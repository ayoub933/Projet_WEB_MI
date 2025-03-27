// frontend/js/model.js

export let produits = [];  // tableau vide au démarrage

export const Panier = {
  panier: [],
  getPanier() { return this.panier; },
  ajouterProduit(produit) { this.panier.push(produit); },
  supprimerProduit(index) { this.panier.splice(index, 1); }
};
