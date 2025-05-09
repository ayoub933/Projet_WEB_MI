
const User = require('../models/userModel');
const Product = require('../models/productModel');
const bcrypt = require('bcrypt');
function setFlashMessage(req, type, message) { }

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(`\n login: ${email}`);
    try {
        const user = await User.findOne({ email });


        const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;

        if (!user || !passwordMatch ) { 
            console.warn(`Login failed: Invalid email or password for ${email}.`);
            setFlashMessage(req, 'error', 'Email ou mot de passe incorrect.');
            return res.redirect('/login');
        }
 


        console.log(`Login success: User ${user.email} (ID: ${user._id}) found.`);
        req.session.user = { id: user._id, email: user.email };

  
        let sessionCartItems = [];
        let calculatedTotal = 0;
        console.log('Chargement Panier BDD');
        console.log('Valeur BRUTE user.cart chargé:', JSON.stringify(user.cart, null, 2));

        if (user.cart && Array.isArray(user.cart) && user.cart.length > 0) {
             const cartFromDB = user.cart;
             console.log(`Panier BDD chargé (${cartFromDB.length} items)`);
             try {
                 const populatedUser = await User.findById(user._id).populate('cart.product');

                 if (populatedUser && populatedUser.cart) {
                      console.log("Peuplement BDD réussi.");
                      sessionCartItems = populatedUser.cart.map(item => {
                          if (!item.product) { return null; }
                          const price = parseFloat(item.product.price) || 0;
                          const quantity = parseInt(item.quantity, 10) || 0;
                          calculatedTotal += price * quantity;
                          return {
                               productId: String(item.product._id), name: item.product.name,
                               price: price, image: item.product.image, quantity: quantity
                          };
                      }).filter(item => item !== null);
                      console.log(`Panier reconstruit pour session (${sessionCartItems.length} items valides).`);
                 } else { console.warn("Echec peuplement ou panier vide après."); }
             } catch(populateError) {
                  console.error("lors du peuplement panier BDD:", populateError);
                  setFlashMessage(req, 'error', 'Erreur chargement détails panier.');
             }
        } else { console.log(`Panier BDD vide ou invalide.`); }

        req.session.cart = {
            items: sessionCartItems, // Le tableau d'items COMPLETS pour la session
            totalPrice: parseFloat(calculatedTotal.toFixed(2)) // Le total calculé pour la session
        };
        console.log('Panier OBJET finalisé en SESSION après login'); console.log(JSON.stringify(req.session.cart, null, 2));
       


        req.session.save(err => {
             if (err) { console.error("session login:", err); /* Gérez l'erreur session */ }
             console.log('Session sauvegardée, redirection vers /');
             res.redirect('/'); // Redirige vers la page d'accueil ou tableau de bord
        });


    } catch (error) {
        console.error("ERREUR GLOBALE login:", error);
        setFlashMessage(req, 'error', 'Erreur serveur connexion.');
        res.redirect('/login');
    }
};


exports.logout = async (req, res) => {
     console.log(`\n--- LOGOUT ATTEMPT: User ${req.session.user ? req.session.user.email : 'N/A'} ---`);
    if (req.session.user && req.session.user.id && req.session.cart && Array.isArray(req.session.cart.items)) {
        const userId = req.session.user.id;
        const itemsToSave = req.session.cart.items.map(item => ({
            product: item.productId, // Prend l'ID produit de la session (string)
            quantity: item.quantity
        }));

        console.log(`Préparation sauvegarde panier (${itemsToSave.length} items) pour user ${userId}`);
        console.log('Données FORMATÉES envoyées à la BDD ---'); console.log(JSON.stringify(itemsToSave, null, 2));

        try {
            // Sauvegarde le tableau FORMATÉ dans le champ 'cart'
            console.log(`Appel User.findByIdAndUpdate pour ID: ${userId}`);
            const updateResult = await User.findByIdAndUpdate(userId,
               { cart: itemsToSave }, // Sauvegarde le tableau formaté
               { new: true, runValidators: true }
            );
            if (updateResult) { console.log(`SAUVEGARDE BDD RÉUSSIE <<<`); }
            else { console.error(`Erreur: User ${userId} non trouvé lors sauvegarde !`); }
        } catch (err) { console.error("Erreur User.findByIdAndUpdate !!!:", err); }
    } else { console.log("Pas de user/panier session valide à sauvegarder."); }

    // détruit la session
    req.session.destroy((err) => {
        if (err) { console.error("destruction session:", err); return res.redirect('/'); }
        console.log("Session détruite.");
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};

exports.registerForm = (req, res) => {
    let messageText = null;
    let messageClass = '';
    if (req.flash) {
        const errorMsg = req.flash('error');
        const successMsg = req.flash('message'); // ou 'success'
        if (errorMsg.length > 0) {
            messageText = errorMsg[0];
            messageClass = 'error';
        } else if (successMsg.length > 0) {
            messageText = successMsg[0];
            messageClass = 'success';
        }
    }
    // Logique session fallback si req.flash n'est pas utilisé
     else if (req.session.message) {
         messageText = req.session.message;
         messageClass = req.session.messageType || 'success';
         delete req.session.message;
         delete req.session.messageType;
     }

    res.render('register', {
        message: messageText, // Passe les messages à la vue EJS
        messageClass: messageClass // Passe la classe CSS du message
    });
};

exports.register = async (req, res) => {
    const { email, password } = req.body; // Récupère email et password du formulaire

    console.log(`\nTentative d'inscription: ${email}`);

    // 1. Validation basique
    if (!email || !password) {
        setFlashMessage(req, 'error', 'Veuillez saisir un email et un mot de passe.');
        return res.redirect('/register');
    }

    try {
        // 2. Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            console.warn(`Inscription échouée: Email déjà utilisé (${email}).`);
            setFlashMessage(req, 'error', 'Cet email est déjà utilisé.');
            return res.redirect('/register');
        }

        // 3. HACHER le mot de passe ( pour la sécurité !)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(`Mot de passe haché généré.`);

        // 4. Créer un nouvel utilisateur avec le mot de passe HACHÉ
        const newUser = new User({
            email: email,
            password: hashedPassword, // Utilisez le mot de passe HACHÉ
            cart: [] // Initialisation du panier vide
            // role et money prendront leurs valeurs par défaut selon votre modèle
        });

        // 5. SAUVEGARDER l'utilisateur dans la BDD
        await newUser.save();
        console.log(`Utilisateur enregistré avec succès: ${newUser.email} (ID: ${newUser._id}).`);

        // 6. Succès : Rediriger vers la connexion
        setFlashMessage(req, 'message', 'Inscription réussie ! Vous pouvez maintenant vous connecter.');
        req.session.save(err => {
             if (err) { console.error("Erreur session save register:", err); }
             res.redirect('/login'); // Redirige vers la page de connexion
        });


    } catch (error) {
        // Gestion des erreurs (validation, doublon, etc.)
        console.error("Erreur lors de l'inscription:", error);
        let errorMessage = "Une erreur est survenue lors de l'inscription.";
        if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
        } else if (error.code === 11000) {
             errorMessage = 'Cet email est déjà utilisé.';
        }
        setFlashMessage(req, 'error', errorMessage);
        req.session.save(err => {
            if (err) { console.error("Erreur session save register (catch):", err); }
            res.redirect('/register');
        });
    }
};
exports.loginForm = (req, res) => {
    let messageText = null;
    let messageClass = '';
    if (req.flash) {
        const errorMsg = req.flash('error');
        const successMsg = req.flash('message'); // ou 'success'
        if (errorMsg.length > 0) {
            messageText = errorMsg[0];
            messageClass = 'error'; 
        } else if (successMsg.length > 0) {
            messageText = successMsg[0];
            messageClass = 'success'; 
        }
    }
    // Logique session fallback
    else if (req.session.message) {
        messageText = req.session.message;
        messageClass = req.session.messageType || 'success';
        delete req.session.message;
        delete req.session.messageType;
    }


    res.render('login', {
        message: messageText, 
        messageClass: messageClass 
    });
};