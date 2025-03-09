// view.js
import { produits, Panier } from "./model.js";

class View {
    static afficherProduits() {
        let container = document.getElementById("produits");
        container.innerHTML = "";

        produits.forEach(produit => {
            let div = document.createElement("div");
            div.classList.add("produit");
            div.innerHTML = `
                <img src="${produit.image}" alt="${produit.nom}">
                <h3>${produit.nom}</h3>
                <p>${produit.prix} €</p>
                <button onclick="Controller.ajouterProduit(${produit.id})">Ajouter</button>
            `;
            container.appendChild(div);
        });
    }

    static afficherPanier() {
        let container = document.getElementById("contenu-panier");
        container.innerHTML = "";
    
        let panier = Panier.getPanier();
        let total = 0;
    
        panier.forEach((produit, index) => {
            let div = document.createElement("div");
            div.classList.add("article");
            div.innerHTML = `
                <span>${produit.nom} - ${produit.prix} €</span>
                <button onclick="Controller.supprimerProduit(${index})">❌</button>
            `;
            container.appendChild(div);
            total += produit.prix;
        });
    
        // Mettre à jour le total
        document.getElementById("total-prix").innerText = total;
    }
}

export { View };
