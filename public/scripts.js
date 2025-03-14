let panier = [];

// TODO: Ajouter une fonction pour afficher les articles dans le panier
// TODO: Ajouter une fonction pour supprimer un article du panier
// TODO: Ajouter une fonction pour mettre à jour la quantité d'un article
// TODO: Sauvegarder le panier dans localStorage pour persistance

// Ajouter un article au panier
function ajouterAuPanier(idProduit) {
    panier.push(idProduit);
    alert("Article ajouté au panier !");
    sauvegarderPanier();
}

// Sauvegarder le panier
function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
}

// Charger le panier au démarrage
window.onload = function() {
    panier = JSON.parse(localStorage.getItem('panier')) || [];
};
