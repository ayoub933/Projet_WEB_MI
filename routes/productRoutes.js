const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.get('/', productController.showHome);
router.post('/add-to-cart/:id', productController.addToCart);


module.exports = router;
