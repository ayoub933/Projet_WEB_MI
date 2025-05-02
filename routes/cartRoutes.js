// =======================================
// == FICHIER FINAL : routes/cartRoutes.js ==
// == (Utilise removeFromCart pour le bouton X) ==
// =======================================
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middlewares/auth');

// Affiche le panier
router.get('/cart', isAuthenticated, cartController.showCart);

// Supprime/Décrémente item via le bouton 'X' (appelle removeFromCart)
router.post('/remove-from-cart/:id', isAuthenticated, cartController.removeFromCart);

// Lance le checkout (simulation)
router.get('/checkout', isAuthenticated, cartController.processCheckout); // Ou POST

// Les routes pour +/-/vider ne sont plus nécessaires avec ce setup
// router.post('/cart/increase/:id', ...);
// router.post('/cart/decrease/:id', ...);
// router.post('/clear-cart', ...);

module.exports = router;