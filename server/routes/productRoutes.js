const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// TODO: Route pour récupérer tous les produits
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// TODO: Route pour récupérer un produit par ID
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

module.exports = router;
