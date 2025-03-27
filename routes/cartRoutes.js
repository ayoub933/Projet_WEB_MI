
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/cart', isAuthenticated, cartController.showCart);

module.exports = router;
