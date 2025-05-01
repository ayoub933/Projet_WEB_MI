// ======================================================
// FICHIER: controllers/productController.js (CORRIGÉ)
// ======================================================
const User = require('../models/userModel'); // Assure-toi d'avoir User si tu maj BDD
// const Product = require('../models/productModel'); // Si tu as un modèle Product

// === Ton tableau ou ta fonction pour trouver les produits ===
const allProducts = [ /* Ta liste de produits ici... */
    { id: 1, _id: "1", name: "Nike Air Max 270", price: 150, image: "/images/demo/air-max-270.jpg" },
    { id: 2, _id: "2", name: "Nike React Element 55", price: 130, image: "/images/demo/react-element-55.jpg" },
    { id: 3, _id: "3", name: "Nike Air Force 1 '07", price: 110, image: "/images/demo/air-force-1.jpg" },
    { id: 4, _id: "4", name: "Nike Zoom Pegasus 39", price: 125, image: "/images/demo/pegasus-39.jpg" },
    { id: 5, _id: "5", name: "Nike Blazer Mid '77", price: 100, image: "/images/demo/blazer-mid-77.jpg" },
    { id: 6, _id: "6", name: "Nike Metcon 8", price: 140, image: "/images/demo/metcon-8.jpg" },
    { id: 12, _id: "12", name: "Nike Revolution 6", price: 75, image: "/images/demo/revolution-6.jpg" },
];
async function findProductById(id) {
    console.log(`DEBUG: Recherche produit ID: ${id}`);
    // Adapte si tu utilises une BDD
    const product = allProducts.find(p => String(p._id) === String(id) || String(p.id) === String(id));
    console.log(`DEBUG: Produit trouvé: ${product ? product.name : 'Non'}`);
    return product;
}
// ==============================================================

// Contrôleur showHome (Assure-toi qu'il est bien exporté: exports.showHome = ...)
exports.showHome = async (req, res) => {
  console.log("INFO: Accès contrôleur showHome");
  const message = req.flash ? (req.flash('message')[0] || req.flash('error')[0]) : (req.session.message || null);
  if (!req.flash) req.session.message = null;

  try {
    const products = allProducts; // Ou requête BDD
    res.render('index', { products: products, message: message });
  } catch (error) {
    console.error("ERREUR chargement produits accueil:", error);
    res.status(500).send("Erreur serveur");
  }
};

// Contrôleur addToCart (CORRIGÉ)
exports.addToCart = async (req, res) => {
    const productId = req.params.id; // ID est une string
    console.log(`INFO: Demande ajout au panier ID: ${productId}`);

    try {
        const product = await findProductById(productId);

        if (!product) {
            console.warn(`WARN: Produit non trouvé ID: ${productId}`);
            const flash = req.flash || ((type, msg) => req.session.message = msg); // Fallback si pas connect-flash
            flash('error', 'Produit introuvable ❌');
            return res.redirect('back');
        }

        // Initialise le panier session avec la BONNE STRUCTURE si besoin
        if (!req.session.cart || typeof req.session.cart !== 'object') {
             req.session.cart = { items: [], totalPrice: 0 };
             console.log("INFO: Panier initialisé en session: { items: [], totalPrice: 0 }");
        }
        // Assure que 'items' est un tableau
        if (!Array.isArray(req.session.cart.items)) {
            req.session.cart.items = [];
             console.log("WARN: req.session.cart.items réinitialisé en tableau vide.");
        }

        // Définit cartItems APRES s'être assuré que req.session.cart.items existe
        let cartItems = req.session.cart.items;
        const productIdentifier = String(product._id || product.id); // Utilise l'ID comme string

        console.log(`INFO: Ajout de produit: ${product.name}, ID utilisé: ${productIdentifier}`);
        const existingItemIndex = cartItems.findIndex(item => String(item.productId) === productIdentifier);

        if (existingItemIndex > -1) { // Article déjà présent
            cartItems[existingItemIndex].quantity = (parseInt(cartItems[existingItemIndex].quantity, 10) || 0) + 1;
            console.log(`INFO: Quantité incrémentée pour ${product.name}. Nvelle qté: ${cartItems[existingItemIndex].quantity}`);
        } else { // Nouvel article
            cartItems.push({
                productId: productIdentifier, // Stocke l'ID du produit
                name: product.name,
                price: parseFloat(product.price) || 0, // Stocke comme nombre
                image: product.image, // Stocke le chemin de l'image
                quantity: 1 // Quantité initiale
            });
            console.log(`INFO: Nouvel article ajouté: ${product.name}`);
        }

        // Recalcule le total DANS la session
        let calculatedTotal = 0;
        cartItems.forEach(item => {
             calculatedTotal += (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 0);
         });
        req.session.cart.totalPrice = parseFloat(calculatedTotal.toFixed(2)); // Met à jour le total

        console.log('--- DEBUG: Panier SESSION après ajout/modif ---');
        console.log(JSON.stringify(req.session.cart, null, 2)); // LOG pour vérifier la structure
        console.log('-------------------------------------------');

        // Mise à jour BDD si user connecté
        if (req.session.user && req.session.user.id) {
             console.log(`INFO: Màj panier BDD pour user ${req.session.user.id}`);
            try {
                 const userCartForDB = req.session.cart; // Sauvegarde l'objet { items: [...], totalPrice: ...}
                 // await User.findByIdAndUpdate(req.session.user.id, { cart: userCartForDB }); // Décommente si tu utilises User BDD
                 console.log(`INFO: Panier BDD (simulation) mis à jour pour ${req.session.user.email}`);
            } catch(err) {
                 console.error("ERREUR: échec màj panier BDD lors ajout:", err);
                 (req.flash || req.session)('error', 'Erreur sauvegarde panier BDD.');
            }
        } else {
            console.log("INFO: User non connecté, màj BDD non effectuée.");
        }

        const successMessage = `"${product.name}" ajouté au panier ✅`;

        // Sauvegarde la session AVANT de répondre/rediriger
        req.session.save(err => {
            if (err) {
                console.error("ERREUR: Sauvegarde session après ajout échouée:", err);
                (req.flash || req.session)('error', 'Erreur session lors de l\'ajout.');
                 // Redirige même si erreur de sauvegarde
                 return res.redirect('back');
            }
             console.log("INFO: Session sauvegardée après ajout.");
             // Réponse AJAX ou redirection
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.json({ success: true, message: successMessage, cart: req.session.cart });
            } else {
                (req.flash || req.session)('message', successMessage);
                return res.redirect('back');
            }
        });

    } catch (error) {
        console.error("ERREUR GLOBALE dans addToCart:", error);
        (req.flash || req.session)('error', 'Erreur lors de l\'ajout au panier.');
        return res.redirect('back');
    }
};