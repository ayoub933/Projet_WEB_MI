// frontend/js/view.js
import { produits, Panier } from "./model.js";

export class View {
  static afficherProduits() {
    const container = document.getElementById("produits");
    if (!container) return;

    container.innerHTML = "";

    produits.forEach(produit => {
      const div = document.createElement("div");
      div.classList.add("produit");
      div.innerHTML = `
        <img src="${produit.lien_image}" alt="${produit.nom}">
        <h3>${produit.nom}</h3>
        <p>Prix: ${produit.prix} €</p>
        <button data-id="${produit.id}" class="ajouter-panier">Ajouter au panier</button>
      `;
      container.appendChild(div);
    });
  }

  static afficherPanier() {
    // ...
  }
}
