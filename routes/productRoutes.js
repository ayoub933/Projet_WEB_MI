const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/', isAuthenticated, productController.showHome);
router.post('/add-to-cart/:id', isAuthenticated, productController.addToCart);

module.exports = router;
