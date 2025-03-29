const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.showHome = async (req, res) => {
  const products = await Product.find();
  const message = req.session.message || null;
  req.session.message = null;

  res.render('index', {
    products,
    message
  });
};

exports.addToCart = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.send('Produit introuvable');
  
    const user = await User.findById(req.session.user.id);
  
    const existingItem = user.cart.find(item => item.product.toString() === productId);
  
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        product: product._id, // ✅ référence
        quantity: 1
      });
    }
  
    await user.save();
    req.session.message = `"${product.name}" ajouté au panier ✅`;
    res.redirect('/');
  };
  