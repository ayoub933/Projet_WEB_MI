const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// TODO: Route d'inscription
router.post('/register', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "Utilisateur créé !" });
});

// TODO: Route de connexion
router.post('/login', async (req, res) => {
    // Vérification des identifiants (à améliorer avec bcrypt)
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (user) {
        res.json({ message: "Connexion réussie !" });
    } else {
        res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }
});

module.exports = router;
