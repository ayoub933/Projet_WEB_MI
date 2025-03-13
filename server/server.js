const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('./server/config/db'); // Connexion à la BDD

// Middleware
app.use(express.json()); // Pour gérer le JSON
app.use(cors()); // Autoriser les requêtes cross-origin

// Import des routes
const productRoutes = require('./server/routes/productRoutes');
const userRoutes = require('./server/routes/userRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
