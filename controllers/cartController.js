exports.showCart = (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { cart });
};
