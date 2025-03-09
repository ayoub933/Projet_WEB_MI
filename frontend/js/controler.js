// controller.js
import { produits, Panier } from "./model.js";
import { View } from "./view.js";

class Controller {
    static ajouterProduit(id) {
        let produit = produits.find(p => p.id === id);
        if (produit) {
            Panier.ajouterAuPanier(produit);
            alert("Produit ajouté !");
        }
    }

    static supprimerProduit(index) {
        Panier.supprimerDuPanier(index);
        View.afficherPanier();
    }
}

// Charger les vues après le chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("produits")) {
        View.afficherProduits();
    }

    if (document.getElementById("contenu-panier")) {
        View.afficherPanier();
    }
});

document.getElementById("vider-panier").addEventListener("click", () => {
    localStorage.removeItem("panier");
    View.afficherPanier();
});

export { Controller };
