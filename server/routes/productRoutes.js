const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// TODO: Ajouter une validation des entrées pour éviter les erreurs
// TODO: Ajouter une route pour ajouter un produit (POST)
// TODO: Ajouter une route pour modifier un produit (PUT)
// TODO: Ajouter une route pour supprimer un produit (DELETE)

// Route pour récupérer tous les produits
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Route pour récupérer un produit par ID
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

module.exports = router;
