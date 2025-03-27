// frontend/js/view.js
import { produits, Panier } from "./model.js";

export class View {
  static afficherProduits() {
    const container = document.getElementById("produits");
    if (!container) return; // si pas sur la page accueil, on ignore

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
    const containerAccueil = document.getElementById("panier");
    const containerPanierPage = document.getElementById("contenu-panier");
    const container = containerAccueil || containerPanierPage;
    if (!container) return; // si aucun conteneur n'existe, on fait rien
  
    container.innerHTML = "";
  
    const list = Panier.getPanier();
    let total = 0;
  
    list.forEach((article, index) => {
      const item = document.createElement("div");
      item.classList.add("article");
  
      // Ajout de l'image "miniature"
      item.innerHTML = `
        <img src="${article.lien_image}" alt="${article.nom}" style="width: 60px; height: auto; margin-right: 10px;">
        <span>${article.nom} - ${article.prix} €</span>
        <button data-index="${index}" class="supprimer-panier">❌</button>
      `;
  
      container.appendChild(item);
      total += parseFloat(article.prix);
    });
  
    const totalElement = document.getElementById("total-prix");
    if (totalElement) {
      totalElement.textContent = total.toFixed(2);
    }
  }


static afficherTousArticles() {
  const container = document.getElementById("liste-articles");
  if (!container) return;

  container.innerHTML = "";

  produits.forEach(produit => {
    const div = document.createElement("div");
    div.classList.add("article");
    div.innerHTML = `
      <img src="${produit.lien_image}" alt="${produit.nom}" style="width:80px; margin-right:8px;">
      <h3>${produit.nom}</h3>
      <p>Prix: ${produit.prix} €</p>
      <button data-id="${produit.id}" class="ajouter-panier">Ajouter au panier</button>
    `;
    container.appendChild(div);
  });
}
}