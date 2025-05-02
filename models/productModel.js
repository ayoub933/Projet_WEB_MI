// ======================================================
// == FICHIER : models/productModel.js                 ==
// ======================================================
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom du produit est requis."],
        trim: true
    },
    image: {
        type: String,
        required: [true, "Le chemin de l'image est requis."] // Ex: /images/mon_produit.jpg
    },
    price: {
        type: Number,
        required: [true, "Le prix est requis."],
        min: [0, "Le prix ne peut pas être négatif."]
    }
    // Ajoute d'autres champs si nécessaire (description, stock...)
    // timestamps: true
});

module.exports = mongoose.model('Product', productSchema);