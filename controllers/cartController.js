const User = require('../models/userModel');
const Product = require('../models/productModel');


// Helper pour messages
function setFlashMessage(req, type, message) {
    if (req.flash) { req.flash(type, message); }
    else { req.session.messageType = type; req.session.message = message; }
    console.log(`Message set (${type}): ${message}`);
}

exports.showCart = async (req, res) => { // Async au cas ou on doit peupler plus tard
    console.log("Accès showCart");
    try {
        // Initialise/Récupère l'OBJET cart de la session { items: [{productId, name, ...}], totalPrice }
        let cart = { items: [], totalPrice: 0 };
        if (req.session.cart && typeof req.session.cart === 'object' && Array.isArray(req.session.cart.items)) {
            cart = req.session.cart;
        } else { req.session.cart = cart; } // Force si invalide

        // Recalcule total (sécurité, même si déjà en session)
        let calculatedTotal = 0;
        cart.items.forEach(item => { calculatedTotal += (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 0); });
        cart.totalPrice = parseFloat(calculatedTotal.toFixed(2)); // S'assure que le total est correct

        console.log('Panier OBJET pour vue showCart');
        console.log(JSON.stringify(cart, null, 2)); // Contient déjà les détails

        // Gestion message
        let messageText = null; let messageClass = '';
        if (req.flash) { const e=req.flash('error'), s=req.flash('message'); if(e.length) { messageText=e[0]; messageClass='error';} else if (s.length) { messageText=s[0]; messageClass='success';}}
        else if (req.session.message) { messageText=req.session.message; messageClass=req.session.messageType||'success'; delete req.session.message; delete req.session.messageType; }

        // >>> Passe l'OBJET cart entier à la vue <<<
        res.render('cart', {
            cart: cart, // Passe l'objet { items: ..., totalPrice: ... }
            message: messageText,
            messageClass: messageClass
        });

    } catch(error) {
        console.error("Erreur showCart:", error);
        setFlashMessage(req, 'error', 'Erreur affichage panier.');
        res.redirect('/');
    }
};

// removeFromCart (Utilise Objet Session, décrémente/supprime) 
exports.removeFromCart = async (req, res) => {
    const productIdToRemove = req.params.id; // ID produit à retirer/décrémenter
    console.log(`remove/decrement ID: ${productIdToRemove}`);

    // Vérifie structure OBJET session
    if (!req.session.cart || typeof req.session.cart !== 'object' || !Array.isArray(req.session.cart.items)) {
        setFlashMessage(req, 'error', 'Panier invalide.');
        return req.session.save ? req.session.save(err => res.redirect('/cart')) : res.redirect('/cart');
    }

    let cartItems = req.session.cart.items; // Tableau DANS l'objet
    const itemIndex = cartItems.findIndex(item => String(item.productId) === String(productIdToRemove));

    if (itemIndex > -1) { // Trouvé
        const item = cartItems[itemIndex];
        if (item.quantity > 1) { // Décrémente
            item.quantity -= 1;
            setFlashMessage(req, 'message', `Quantité réduite.`);
        } else { // Supprime
            const removedName = item.name;
            cartItems.splice(itemIndex, 1);
            setFlashMessage(req, 'message', `Article "${removedName}" retiré.`);
        }

        // Recalcule et met à jour le total DANS l'objet session
        let calculatedTotal = 0;
        req.session.cart.items.forEach(it => { calculatedTotal += (parseFloat(it.price) || 0) * (parseInt(it.quantity, 10) || 0); });
        req.session.cart.totalPrice = parseFloat(calculatedTotal.toFixed(2));

        console.log('Panier OBJET SESSION APRÈS remove/decrement');
        console.log(JSON.stringify(req.session.cart, null, 2));
        // Pas de màj BDD ici (fait au logout)

    } else { setFlashMessage(req, 'error', `Article introuvable.`); }

    req.session.save(err => { return res.redirect('/cart'); });
};


// processCheckout (Utilise Objet Session)
exports.processCheckout = async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) { setFlashMessage(req, 'error','Connexion requise'); return res.redirect('/login'); }
    // Vérifie l'objet cart et le tableau items
    if (!req.session.cart || !Array.isArray(req.session.cart.items) || req.session.cart.items.length === 0) {
        setFlashMessage(req, 'error', 'Panier vide.'); return res.redirect('/cart');
    }

    const cart = req.session.cart; // L'objet cart
    console.log(`INFO: Checkout user ${userId}`);
    try {
        console.log("(Simulation)");
        console.log(`Utilisateur: ${userId}`);
        console.log("Articles:");
        cart.items.forEach(item => { console.log(`  - ${item.name} (ID: ${item.productId}) x ${item.quantity} @ ${item.price}€`); });
        console.log(`Total: ${cart.totalPrice} €`); 

        // Vide panier session (réinitialise l'objet)
        req.session.cart = { items: [], totalPrice: 0 };

        // Vide panier BDD (sauvegarde tableau vide formaté correctement)
        try {
            // Le schéma attend [{ product: ObjectId, quantity }] donc on sauvegarde un tableau vide
            await User.findByIdAndUpdate(userId, { cart: [] });
            console.log(`Panier BDD vidé pour user ${userId}.`);
        } catch (dbError) { console.error("Erreur vidage BDD:", dbError); }

        req.session.save(err => { setFlashMessage(req, 'message', 'Merci ! Commande simulée.'); return res.redirect('/'); });
    } catch (error) {
        console.error("Erreur checkout:", error);
        setFlashMessage(req, 'error', 'Erreur validation commande.');
        res.redirect('/cart');
     }
};