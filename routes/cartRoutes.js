
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middlewares/auth'); // Assure-toi que ce chemin est correct

router.get('/cart', isAuthenticated, cartController.showCart);
// Ajoute cette ligne pour la suppression :
router.post('/remove-from-cart/:id', isAuthenticated, cartController.removeFromCart);

module.exports = router;