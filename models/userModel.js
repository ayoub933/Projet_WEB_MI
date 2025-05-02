// ======================================================
// == FICHIER : models/userModel.js                    ==
// == Structure panier : Tableau [{product ID, qté}]   ==
// ======================================================
const mongoose = require('mongoose');

// Schéma pour les items DANS le tableau 'cart' de l'utilisateur
const cartItemSchema = new mongoose.Schema({
    product: { // Stocke la référence vers le Produit
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // <<< IMPORTANT: Doit correspondre au nom du modèle Product
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
}, { _id: false }); // Pas d'_id spécifique pour le sous-document cart item

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // PENSE À HASHER !
    role: { type: String, default: 'user' },
    // Le panier stocke un tableau de cartItemSchema
    cart: [cartItemSchema], // <<< Structure attendue par la BDD
    money: { type: Number, default: 100 } // Optionnel
    // timestamps: true
});

// Supprime l'extra 'cart: [{...}]' qui était hors schéma dans ton exemple précédent
module.exports = mongoose.model('User', userSchema);