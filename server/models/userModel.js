const mongoose = require('mongoose');

// TODO: Ajouter un champ pour stocker le rôle (admin, client, etc.)
// TODO: Hasher le mot de passe avant de l'enregistrer
// TODO: Ajouter un champ "date de création" automatique

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
