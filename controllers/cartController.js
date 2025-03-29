const User = require('../models/userModel');

exports.showCart = async (req, res) => {
    const user = await User.findById(req.session.user.id).populate('cart.product');
    const cart = user.cart || [];
  
    const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  
    res.render('cart', { cart, total }); // ✅ on passe bien total ici
  };
  
  

exports.increaseQty = async (req, res) => {
    console.log('↗️ Route increase appelée pour', req.params.id);
  
    const user = await User.findById(req.session.user.id);
    if (!user) {
      console.log("❌ Utilisateur non trouvé ou non authentifié");
      return res.redirect('/login'); // ou autre
    }
  
    const item = user.cart.find(i => i.product.toString() === req.params.id);
    if (item) {
      item.quantity += 1;
      await user.save();
      console.log("✅ Quantité augmentée");
    }
  
    res.redirect('/cart');
  };
  
  

exports.decreaseQty = async (req, res) => {
  const user = await User.findById(req.session.user.id);
  const productId = req.params.id;

  const index = user.cart.findIndex(i => i.product.toString() === productId);
  if (index !== -1) {
    if (user.cart[index].quantity > 1) {
      user.cart[index].quantity -= 1;
    } else {
      user.cart.splice(index, 1);
    }
    await user.save();
  }

  res.redirect('/cart');
};

exports.clearCart = async (req, res) => {
  await User.findByIdAndUpdate(req.session.user.id, { cart: [] });
  res.redirect('/cart');
};

exports.checkout = async (req, res) => {
  const user = await User.findById(req.session.user.id).populate('cart.product');
  const cart = user.cart || [];

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (user.money < total) {
    req.session.message = "❌ Fonds insuffisants pour valider l'achat.";
    return res.redirect('/cart');
  }

  user.money -= total;
  user.cart = [];
  await user.save();

  req.session.message = "✅ Achat validé avec succès !";
  res.redirect('/');
};
