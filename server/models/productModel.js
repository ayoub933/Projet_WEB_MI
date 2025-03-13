const mongoose = require('mongoose');

// TODO: Ajouter un champ pour la catégorie du produit
// TODO: Ajouter un champ pour les avis des utilisateurs
// TODO: Ajouter un timestamp automatique pour la date d'ajout du produit

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    stock: { type: Number, default: 10 }
});

module.exports = mongoose.model('Product', productSchema);
