// ======================================================
// FICHIER: controllers/cartController.js (CORRIGÉ)
// ======================================================
const User = require('../models/userModel'); // Assure-toi que l'import est bon

// Afficher le panier
exports.showCart = (req, res) => {
    // Initialise avec la bonne structure si vide ou invalide
    let cart = { items: [], totalPrice: 0 };
    if (req.session.cart && typeof req.session.cart === 'object' && Array.isArray(req.session.cart.items)) {
        cart = req.session.cart;
    } else if (Array.isArray(req.session.cart)) {
        // Tente de récupérer ancien format (juste tableau d'items)
        console.warn("WARN: Ancien format de panier détecté en session (tableau). Conversion...");
        cart.items = req.session.cart;
    }

    // Recalcule TOUJOURS le total pour la vue (plus sûr)
    let calculatedTotal = 0;
    cart.items.forEach(item => {
        calculatedTotal += (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 0);
    });
    // Met à jour l'objet cart qu'on passe à la vue
    cart.totalPrice = parseFloat(calculatedTotal.toFixed(2));

    console.log('--- DEBUG: Panier pour la vue showCart ---');
    console.log('User Session ID:', req.session.user ? req.session.user.id : 'N/A');
    console.log('Cart Object:', JSON.stringify(cart, null, 2)); // Vérifie la structure ici !
    console.log('------------------------------------------');

    // Récupère les messages Flash
    const message = req.flash ? (req.flash('message')[0] || req.flash('error')[0]) : null;

    res.render('cart', {
        cart: cart, // Passe l'objet { items: [...], totalPrice: ... }
        message: message // Passe le message flash
    });
};

function setFlashMessage(req, type, message) {
    if (req.flash) { req.flash(type, message); }
    else { req.session.messageType = type; req.session.message = message; }
    console.log(`DEBUG: Message set (${type}): ${message}`);
}

// --- Supprimer un article du panier (Version Finale Robuste) ---
exports.removeFromCart = async (req, res) => {
    const productIdToRemove = req.params.id; // ID produit (string)
    console.log(`INFO: Demande suppression/décrément pour productId: ${productIdToRemove}`);

    // Vérifie si panier et items existent
    if (!req.session.cart || !Array.isArray(req.session.cart.items)) {
        console.warn("WARN: Panier session vide/invalide pour remove/decrement.");
        setFlashMessage(req, 'error', 'Votre panier est vide ou invalide.');
        return req.session.save ? req.session.save(err => res.redirect('/cart')) : res.redirect('/cart');
    }

    let cartItems = req.session.cart.items; // Référence directe au tableau d'items
    console.log('--- DEBUG: Panier SESSION AVANT remove/decrement ---');
    console.log(JSON.stringify(cartItems, null, 2)); // Log les items

    // --- TROUVE L'INDEX de l'item ---
    const itemIndex = cartItems.findIndex(item => String(item.productId) === String(productIdToRemove));
    // -------------------------------

    let messageText = ''; // Pour le message flash

    if (itemIndex > -1) { // Item trouvé !
        const item = cartItems[itemIndex];
        console.log(`INFO: Article trouvé: ${item.name}, Quantité actuelle: ${item.quantity}`);

        // --- LOGIQUE DÉCRÉMENTATION / SUPPRESSION ---
        if (item.quantity > 1) {
            // Si quantité > 1, on décrémente seulement
            item.quantity -= 1; // Modifie directement l'item dans le tableau
            messageText = `Quantité de "${item.name}" réduite à ${item.quantity}.`;
            console.log(`INFO: Quantité décrémentée. Nouvelle qté: ${item.quantity}`);
        } else {
            // Si quantité <= 1, on supprime l'item entièrement
            cartItems.splice(itemIndex, 1); // Supprime l'item du tableau cartItems
            messageText = `Article "${item.name}" retiré du panier.`;
            console.log(`INFO: Article retiré (quantité était 1).`);
        }
        // ------------------------------------------

        // Pas besoin de faire `req.session.cart.items = cartItems;` car on a modifié le tableau directement

        // Recalcule le prix total
        let calculatedTotal = 0;
        req.session.cart.items.forEach(it => {
            calculatedTotal += (parseFloat(it.price) || 0) * (parseInt(it.quantity, 10) || 0);
        });
        req.session.cart.totalPrice = parseFloat(calculatedTotal.toFixed(2));
        console.log(`INFO: Nouveau total calculé: ${req.session.cart.totalPrice}`);

        setFlashMessage(req, 'message', messageText); // Message succès ou info

        // Mise à jour BDD (Optionnel ici, fait au logout)
        // if (req.session.user && req.session.user.id) { ... }

    } else {
        // Item non trouvé
        console.warn(`WARN: Article ID ${productIdToRemove} NON trouvé pour suppression/décrément.`);
        setFlashMessage(req, 'error', `Article introuvable dans le panier.`);
    }

    console.log('--- DEBUG: Panier SESSION APRÈS remove/decrement ---');
    console.log(JSON.stringify(req.session.cart, null, 2));

    // Sauvegarde la session explicitement AVANT de rediriger
    req.session.save(err => {
        if (err) { console.error("ERREUR: Sauvegarde session après remove/decrement échouée:", err); }
        else { console.log("INFO: Session sauvegardée après remove/decrement."); }
        return res.redirect('/cart');
    });
};