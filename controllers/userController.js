// ======================================================
// VÉRIFIE ET CORRIGE : controllers/userController.js
// ======================================================
const User = require('../models/userModel');
// const bcrypt = require('bcrypt'); // Si tu utilises bcrypt pour les mots de passe

// === VÉRIFIE QUE CHAQUE FONCTION COMMENCE PAR 'exports.' ===

// Pour afficher le formulaire d'inscription
exports.registerForm = (req, res) => {
    // Ajoute un log pour être sûr qu'elle est appelée
    console.log("INFO: Accès contrôleur registerForm");
    res.render('register', { error: req.flash ? req.flash('error')[0] : null }); // Passe les erreurs flash éventuelles
};

// Pour traiter l'inscription
exports.register = async (req, res) => {
    const { email, password } = req.body; // Récupère email et mot de passe du formulaire
    console.log(`INFO: Tentative inscription pour: ${email}`);
    try {
        // Vérifie si l'email existe déjà
        const existing = await User.findOne({ email: email });
        if (existing) {
            console.warn(`WARN: Email déjà utilisé lors de l'inscription: ${email}`);
            (req.flash || req.session)('error', 'Cet email est déjà utilisé.'); // Message d'erreur
            return res.redirect('/register'); // Redirige vers le formulaire
        }

        // === ATTENTION : Hashage de mot de passe MANQUANT ===
        // En production, il FAUT hasher le mot de passe avant de sauvegarder
        // Exemple avec bcrypt:
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        // const user = new User({ email, password: hashedPassword });
        // Pour l'instant, sans hashage (NON SÉCURISÉ)
        const user = new User({ email, password });
        // === FIN ATTENTION ===

        await user.save(); // Sauvegarde le nouvel utilisateur
        console.log(`INFO: Nouvel utilisateur enregistré: ${email}`);
        (req.flash || req.session)('message', 'Inscription réussie ! Vous pouvez maintenant vous connecter.'); // Message succès
        res.redirect('/login'); // Redirige vers la page de connexion

    } catch (error) {
         console.error("ERREUR lors de l'inscription:", error);
         (req.flash || req.session)('error', 'Erreur lors de l\'inscription.');
         res.redirect('/register'); // Redirige vers le formulaire en cas d'erreur
    }
};

// Pour afficher le formulaire de connexion
exports.loginForm = (req, res) => {
     // Ajoute un log pour être sûr qu'elle est appelée
    console.log("INFO: Accès contrôleur loginForm");
    res.render('login', { error: req.flash ? req.flash('error')[0] : null }); // Passe les erreurs flash
};

// ======================================================
// CORRECTION pour controllers/userController.js
// (Focus sur login et logout pour sauvegarde/chargement panier)
// ======================================================
// const bcrypt = require('bcrypt'); // Décommente si tu utilises bcrypt

// Helper pour les messages (si tu utilises connect-flash ou session simple)
function setFlashMessage(req, type, message) {
    if (req.flash) { req.flash(type, message); }
    else { req.session.messageType = type; req.session.message = message; }
}

// ... registerForm, register ...
exports.registerForm = (req, res) => { /* Ton code ici */ res.render('register'); };
exports.register = async (req, res) => { /* Ton code ici */ };
exports.loginForm = (req, res) => { /* Ton code ici */ res.render('login'); };


// === login (CORRIGÉ pour initialiser le panier session correctement) ===
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`INFO: Tentative connexion: ${email}`);
    try {
        // --- Trouve l'utilisateur et vérifie le mot de passe ---
        const user = await User.findOne({ email });
        // ATTENTION: Comparaison mdp en clair - Remplace par bcrypt si besoin
        if (!user || user.password !== password) {
             console.warn(`WARN: Échec connexion pour: ${email}`);
             setFlashMessage(req, 'error', 'Email ou mot de passe incorrect.');
             return res.redirect('/login');
        }
        console.log(`INFO: Connexion réussie pour: ${user.email}`);
        // -------------------------------------------------------

        // Crée la session utilisateur
        req.session.user = { id: user._id, email: user.email };

        // --- CHARGEMENT/INITIALISATION PANIER SESSION ---
        let sessionCartItems = [];
        // Vérifie si user.cart existe en BDD et si c'est un TABLEAU (structure attendue en BDD)
        if (user.cart && Array.isArray(user.cart)) {
            sessionCartItems = user.cart; // Charge les items depuis la BDD
            console.log(`INFO: Panier chargé depuis BDD (${sessionCartItems.length} items)`);
        } else {
            console.log(`INFO: Pas de panier valide (tableau) trouvé en BDD.`);
            // Si user.cart existe mais n'est pas un tableau, log un avertissement
            if (user.cart) {
                console.warn("WARN: user.cart trouvé en BDD mais n'est pas un tableau:", user.cart);
            }
        }

        // Recalcule le total à partir des items chargés
        let calculatedTotal = 0;
        sessionCartItems.forEach(item => {
            calculatedTotal += (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 0);
        });

        // Définit la structure standard en session : { items: Array, totalPrice: Number }
        req.session.cart = {
            items: sessionCartItems,
            totalPrice: parseFloat(calculatedTotal.toFixed(2))
        };
        console.log('--- DEBUG: Panier initialisé en SESSION après login ---');
        console.log(JSON.stringify(req.session.cart, null, 2));
        console.log('----------------------------------------------------');
        // --- FIN CHARGEMENT PANIER ---

        // Sauvegarde session avant redirection
        req.session.save(err => {
            if (err) { console.error("ERREUR session login:", err); setFlashMessage(req, 'error', 'Erreur session.'); return res.redirect('/login');}
            console.log('INFO: Session sauvegardée après login.');
            res.redirect('/'); // Redirige vers l'accueil
        });

    } catch (error) {
        console.error("ERREUR GLOBALE login:", error);
        setFlashMessage(req, 'error', 'Erreur serveur connexion.');
        res.redirect('/login');
    }
};


// === logout (CORRIGÉ pour sauvegarder la bonne structure en BDD) ===
exports.logout = async (req, res) => {
     console.log(`INFO: Déconnexion user: ${req.session.user ? req.session.user.email : 'N/A'}`);

    // Sauvegarde le panier de la session vers la BDD AVANT de détruire la session
    // Vérifie si user et cart.items existent et que items est bien un tableau
    if (req.session.user && req.session.user.id && req.session.cart && Array.isArray(req.session.cart.items)) {
        const userId = req.session.user.id;
        // === IMPORTANT: Sauvegarde UNIQUEMENT le tableau d'items ===
        // (Adapte si ton schéma User attend autre chose, par ex: req.session.cart entier)
        const itemsToSave = req.session.cart.items;
        console.log(`INFO: Tentative Sauvegarde panier (${itemsToSave.length} items) avant déconnexion pour user ${userId}`);
        console.log('DEBUG: Items à sauvegarder:', JSON.stringify(itemsToSave, null, 2));

        try {
             // Sauvegarde directement le TABLEAU dans le champ 'cart' de l'utilisateur
             // Assure-toi que ton schéma User définit 'cart: [ItemSchema]' ou similaire
             const updateResult = await User.findByIdAndUpdate(userId,
                { cart: itemsToSave },
                { new: true, runValidators: true } // Options utiles
             );
             if (updateResult) {
                 console.log(`INFO: Panier BDD sauvegardé pour ${req.session.user.email}.`);
             } else {
                 console.warn(`WARN: User ${userId} non trouvé lors de la sauvegarde du panier.`);
             }
        } catch (err) {
             console.error("ERREUR sauvegarde panier BDD lors déconnexion:", err);
             // On ne bloque pas la déconnexion pour une erreur de sauvegarde ici
        }
    } else {
        console.log("INFO: Pas de user connecté ou panier session invalide, pas de sauvegarde BDD.");
    }

    // Détruit la session
    req.session.destroy((err) => {
        if (err) { console.error("ERREUR destruction session:", err); return res.redirect('/'); }
        console.log("INFO: Session détruite.");
        res.clearCookie('connect.sid'); // Nom de cookie par défaut d'express-session
        res.redirect('/login'); // Redirige vers login
    });
};