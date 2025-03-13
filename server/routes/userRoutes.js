const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// TODO: Ajouter une validation pour s'assurer que les emails sont valides
// TODO: Hasher les mots de passe avant de les enregistrer
// TODO: Implémenter un token JWT pour l'authentification
// TODO: Ajouter une route pour récupérer les infos d'un utilisateur (GET /:id)

// Route d'inscription
router.post('/register', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "Utilisateur créé !" });
});

// Route de connexion
router.post('/login', async (req, res) => {
    // TODO: Remplacer cette vérification basique par une vraie auth sécurisée
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (user) {
        res.json({ message: "Connexion réussie !" });
    } else {
        res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }
});

module.exports = router;
