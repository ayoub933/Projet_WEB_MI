// ======================================================
// == FICHIER COMPLET : controllers/productController.js ==
// == Utilise la BDD Product + Panier Session OBJET      ==
// ======================================================
const User = require('../models/userModel');
const Product = require('../models/productModel'); // <<< UTILISE LE MODÈLE BDD Product

// Fonction pour trouver produit par ID depuis la BDD
async function findProductById(id) {
    console.log(`DEBUG: Recherche produit BDD ID: ${id}`);
    try {
        const product = await Product.findById(id); // Cherche en BDD
        console.log(`DEBUG: Produit trouvé BDD: ${product ? product.name : 'Non trouvé'}`);
        return product;
    } catch (error) {
        if (error.name === 'CastError') { console.warn(`WARN: ID produit BDD invalide: ${id}`); return null; }
        console.error("ERREUR findProductById:", error); throw error;
    }
}
// ==============================================================

// Helper pour messages (si tu l'utilises)
function setFlashMessage(req, type, message) {
    if (req.flash) { req.flash(type, message); }
    else { req.session.messageType = type; req.session.message = message; }
    console.log(`DEBUG: Message set (${type}): ${message}`);
}

// --- showHome (Utilise la BDD Product) ---
exports.showHome = async (req, res) => {
    console.log("INFO: Accès contrôleur showHome");
    const message = req.flash ? (req.flash('message')[0] || req.flash('error')[0]) : (req.session.message || null);
    if (!req.flash && req.session.message) { delete req.session.message; delete req.session.messageType; }
    try {
        const products = await Product.find({}); // <<< Récupère depuis BDD >>>
        console.log(`INFO: ${products.length} produits trouvés en BDD pour l'accueil.`);
        if (products.length === 0) {
             console.warn("WARN: Aucun produit trouvé dans la collection 'products'. Vérifie ta BDD !");
        }
        res.render('index', {
            products: products, // Passe les vrais produits BDD à la vue
            message: message
        });
    } catch (error) {
        console.error("ERREUR chargement produits accueil:", error);
        res.status(500).send("Erreur serveur lors du chargement des produits.");
    }
};


// --- addToCart (Utilise la BDD Product + Session OBJET { items, totalPrice }) ---
exports.addToCart = async (req, res) => {
    const productId = req.params.id; // ID (string, _id MongoDB)
    console.log(`INFO: addToCart - ID Reçu: ${productId}`);
    try {
        const product = await findProductById(productId); // Cherche en BDD
        if (!product) {
            setFlashMessage(req, 'error', 'Produit introuvable ❌');
            return res.redirect('back');
        }

        // Initialise/Vérifie la structure OBJET session { items: [], totalPrice: 0 }
        if (!req.session.cart || typeof req.session.cart !== 'object') req.session.cart = { items: [], totalPrice: 0 };
        if (!Array.isArray(req.session.cart.items)) req.session.cart.items = [];

        let cartItems = req.session.cart.items; // Référence le tableau DANS l'objet
        const productIdentifier = String(product._id); // Utilise _id de la BDD

        const existingItemIndex = cartItems.findIndex(item => String(item.productId) === productIdentifier);

        if (existingItemIndex > -1) { // Déjà présent -> Incrémente quantité
            cartItems[existingItemIndex].quantity += 1;
            console.log(`INFO: Quantité incrémentée pour ${product.name}.`);
        } else { // Nouveau -> Ajoute item complet à la session
            cartItems.push({
                productId: productIdentifier, // ID produit BDD (string)
                name: product.name,
                price: parseFloat(product.price) || 0,
                image: product.image, // Chemin image du produit BDD
                quantity: 1
            });
            console.log(`INFO: Nouvel article ajouté: ${product.name}`);
        }

        // Recalcule et met à jour le total DANS l'objet session
        let calculatedTotal = 0;
        cartItems.forEach(item => { calculatedTotal += (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 0); });
        req.session.cart.totalPrice = parseFloat(calculatedTotal.toFixed(2)); // Met à jour totalPrice

        console.log('--- DEBUG: Panier SESSION OBJET après ajout/modif ---');
        console.log(JSON.stringify(req.session.cart, null, 2));

        // Pas de màj BDD ici (sera fait au logout)

        const successMessage = `"${product.name}" ajouté au panier ✅`;
        setFlashMessage(req, 'message', successMessage);

        // Sauvegarde session avant réponse/redirection
        req.session.save(err => {
            if (err) { console.error("ERREUR save session addToCart:", err); }
             // Réponse AJAX ou redirection
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                console.log("DEBUG: Réponse JSON envoyée pour AJAX.");
                return res.json({ success: true, message: successMessage, cart: req.session.cart });
             } else {
                 console.log("DEBUG: Redirection classique.");
                return res.redirect('back');
             }
        });
    } catch (error) {
         console.error("ERREUR GLOBALE addToCart:", error);
         setFlashMessage(req, 'error', 'Erreur ajout panier.');
         return res.redirect('back');
     }
};