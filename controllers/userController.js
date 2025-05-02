// ======================================================
// == FICHIER COMPLET : controllers/userController.js  ==
// == (Session OBJET / Sauvegarde Array BDD)           ==
// ======================================================
const User = require('../models/userModel');
const Product = require('../models/productModel'); // <<< IMPORTANT pour populate login
function setFlashMessage(req, type, message) { /* ... */ }

// --- login (Charge Array BDD [{ product: ID, quantity }], PEUPLE, Crée Objet Session) ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`\n--- LOGIN ATTEMPT: ${email} ---`);
    try {
        const user = await User.findOne({ email });
        // ATTENTION: Comparaison mdp en clair
        if (!user || user.password !== password ) {
             setFlashMessage(req, 'error', 'Email ou mot de passe incorrect.');
             return res.redirect('/login');
        }
        console.log(`LOGIN SUCCESS: User ${user.email} (ID: ${user._id}) found.`);
        req.session.user = { id: user._id, email: user.email };

        // --- CHARGEMENT ET PEUPLEMENT PANIER ---
        let sessionCartItems = [];
        let calculatedTotal = 0;
        console.log('--- LOGIN: Chargement Panier BDD ---');
        console.log('Valeur BRUTE user.cart chargé:', JSON.stringify(user.cart, null, 2)); // Doit être [{ product: ID, quantity }]

        // Charge le tableau [{ product: ID, quantity }] depuis la BDD
        if (user.cart && Array.isArray(user.cart) && user.cart.length > 0) {
            const cartFromDB = user.cart;
            console.log(`INFO: Panier BDD (Array IDs) chargé (${cartFromDB.length} items)`);
            try {
                // Peuple les détails des produits pour la session
                const populatedUser = await User.findById(user._id).populate('cart.product'); // Assure 'ref: Product' dans userSchema

                if (populatedUser && populatedUser.cart) {
                     console.log("INFO: Peuplement BDD réussi.");
                     sessionCartItems = populatedUser.cart.map(item => {
                         if (!item.product) { return null; } // Sécurité
                         const price = parseFloat(item.product.price) || 0;
                         const quantity = parseInt(item.quantity, 10) || 0;
                         calculatedTotal += price * quantity; // Calcule total ici
                         // Crée l'item pour la session { productId, name, price, image, quantity }
                         return {
                             productId: String(item.product._id), name: item.product.name,
                             price: price, image: item.product.image, quantity: quantity
                         };
                     }).filter(item => item !== null);
                     console.log(`INFO: Panier reconstruit pour session (${sessionCartItems.length} items valides).`);
                } else { console.warn("WARN: Echec peuplement ou panier vide après."); }
            } catch(populateError) {
                console.error("ERREUR lors du peuplement panier BDD:", populateError);
                setFlashMessage(req, 'error', 'Erreur chargement détails panier.');
            }
        } else { console.log(`INFO: Panier BDD vide ou invalide.`); }

        // Crée l'OBJET en session
        req.session.cart = {
            items: sessionCartItems, // Le tableau d'items COMPLETS
            totalPrice: parseFloat(calculatedTotal.toFixed(2)) // Le total calculé
        };
        console.log('--- DEBUG: Panier OBJET finalisé en SESSION après login ---'); console.log(JSON.stringify(req.session.cart, null, 2));

        req.session.save(err => {
            if (err) { console.error("ERREUR session login:", err); /* ... */}
            console.log('INFO: Session sauvegardée, redirection vers /');
            res.redirect('/');
        });
        // --- FIN CHARGEMENT PANIER ---

    } catch (error) {
        console.error("ERREUR GLOBALE login:", error);
        setFlashMessage(req, 'error', 'Erreur serveur connexion.');
        res.redirect('/login');
     }
};


// --- logout (Sauvegarde Array BDD [{ product: ID, quantity }] depuis Objet Session) ---
exports.logout = async (req, res) => {
     console.log(`\n--- LOGOUT ATTEMPT: User ${req.session.user ? req.session.user.email : 'N/A'} ---`);
    // Vérifie user et la structure OBJET en session
    if (req.session.user && req.session.user.id && req.session.cart && Array.isArray(req.session.cart.items)) {
        const userId = req.session.user.id;

        // <<< FORMATTAGE pour correspondre au schéma BDD [{ product: ObjectId, quantity }] >>>
        const itemsToSave = req.session.cart.items.map(item => ({
            product: item.productId, // Prend l'ID produit de la session (string)
            quantity: item.quantity
        }));
        // ============================================================================

        console.log(`INFO: Préparation sauvegarde panier (${itemsToSave.length} items) pour user ${userId}`);
        console.log('--- DEBUG: Données FORMATÉES envoyées à la BDD ---'); console.log(JSON.stringify(itemsToSave, null, 2));

        try {
            // Sauvegarde le tableau FORMATÉ dans le champ 'cart'
            // >> VÉRIFIE que ton schéma User attend bien [{ product: ObjectId, quantity }] <<
            console.log(`INFO: Appel User.findByIdAndUpdate pour ID: ${userId}`);
            const updateResult = await User.findByIdAndUpdate(userId,
               { cart: itemsToSave }, // Sauvegarde le tableau formaté
               { new: true, runValidators: true }
            );
            if (updateResult) { console.log(`--- LOGOUT --- >>> SAUVEGARDE BDD RÉUSSIE <<<`); }
            else { console.error(`--- LOGOUT --- !!! ERREUR: User ${userId} non trouvé lors sauvegarde !`); }
        } catch (err) { console.error("--- LOGOUT --- !!! ERREUR User.findByIdAndUpdate !!!:", err); }
    } else { console.log("INFO: Pas de user/panier session valide à sauvegarder."); }

    // Détruit la session
    req.session.destroy((err) => {
        if (err) { console.error("ERREUR destruction session:", err); return res.redirect('/'); }
        console.log("INFO: Session détruite.");
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};

// --- Autres exports userController ---
exports.registerForm = (req, res) => { res.render('register'); /* + logique message */ };
exports.register = async (req, res) => { /* ... ton code register ... */ };
exports.loginForm = (req, res) => { res.render('login'); /* + logique message */ };