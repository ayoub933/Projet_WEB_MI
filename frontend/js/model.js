// model.js
class Produit {
    constructor(id, nom, prix, image) {
        this.id = id;
        this.nom = nom;
        this.prix = prix;
        this.image = image;
    }
}

// Liste des produits (simulée avant backend)
const produits = [
    new Produit(1, "T-Shirt Bleu", 20, "images/tshirt_bleu.jpg"),
    new Produit(2, "Sweat Noir", 35, "images/sweat_noir.jpg"),
    new Produit(3, "Jean Slim", 45, "images/jean_slim.jpg"),
];

// Gestion du panier avec LocalStorage
class Panier {
    static getPanier() {
        return JSON.parse(localStorage.getItem("panier")) || [];
    }

    static ajouterAuPanier(produit) {
        let panier = this.getPanier();
        panier.push(produit);
        localStorage.setItem("panier", JSON.stringify(panier));
    }

    static supprimerDuPanier(id) {
        let panier = this.getPanier().filter(item => item.id !== id);
        localStorage.setItem("panier", JSON.stringify(panier));
    }
}

export { produits, Panier };
