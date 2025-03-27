const allProducts = [
    { id: 1, name: "Téléphone", image: "/images/1.jpg" },
    { id: 2, name: "Casque", image: "/images/1.jpg" },
    { id: 3, name: "Ordinateur", image: "/images/1.jpg" }
];

exports.showHome = (req, res) => {
    const message = req.session.message || null;
    req.session.message = null;

    res.render('index', {
        products: allProducts,
        message
    });
};

const User = require('../models/userModel'); // importe User

exports.addToCart = async (req, res) => {
    const productId = parseInt(req.params.id);
    const product = allProducts.find(p => p.id === productId);

    if (!product) return res.send('Produit introuvable');

    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart.push(product);
    req.session.message = `"${product.name}" ajouté au panier ✅`;

    // 🔥 Mise à jour en base
    if (req.session.user) {
        await User.findByIdAndUpdate(
            req.session.user.id,
            { cart: req.session.cart }
        );
    }

    res.redirect('/');
};
