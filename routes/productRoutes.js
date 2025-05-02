// =======================================
// == FICHIER FINAL : routes/productRoutes.js ==
// =======================================
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated } = require('../middlewares/auth'); // Ton middleware

// Route pour la page d'accueil (utilise la BDD maintenant)
router.get('/', isAuthenticated, productController.showHome);

// Route pour ajouter au panier (utilise la BDD pour trouver le produit)
router.post('/add-to-cart/:id', isAuthenticated, productController.addToCart);

module.exports = router;