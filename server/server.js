const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('./config/db'); // Connexion à la BDD

// TODO: Ajouter la gestion des sessions pour l'authentification
// TODO: Ajouter la gestion des erreurs globales
// TODO: Configurer dotenv pour les variables d'environnement

app.use(express.json()); // Middleware pour JSON
app.use(cors()); // Middleware CORS

// Import des routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// TODO: Ajouter des logs pour les requêtes
// TODO: Ajouter une route de test pour vérifier que le serveur fonctionne bien

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
