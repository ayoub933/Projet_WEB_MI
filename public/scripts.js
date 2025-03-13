let panier = [];

// TODO: Ajouter un article au panier
function ajouterAuPanier(idProduit) {
    panier.push(idProduit);
    alert("Article ajouté au panier !");
}

// TODO: Sauvegarder le panier dans le localStorage
function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
}
