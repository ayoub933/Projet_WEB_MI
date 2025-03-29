const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middlewares/auth');

// 📦 Panier
router.get('/cart', isAuthenticated, cartController.showCart);
// 📦 Panier
router.post('/cart/increase/:id', isAuthenticated, cartController.increaseQty);
router.post('/cart/decrease/:id', isAuthenticated, cartController.decreaseQty);

router.post('/clear-cart', isAuthenticated, cartController.clearCart);
router.post('/checkout', isAuthenticated, cartController.checkout);


module.exports = router;
