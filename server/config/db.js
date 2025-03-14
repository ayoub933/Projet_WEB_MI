const mongoose = require('mongoose');

// TODO: Rendre l'URL de la base de données configurable avec dotenv
// TODO: Ajouter un mécanisme de reconnexion automatique en cas d'échec

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connecté à MongoDB");
    } catch (error) {
        console.error("❌ Erreur de connexion à MongoDB", error);
        process.exit(1);
    }
};

connectDB();

module.exports = mongoose;
