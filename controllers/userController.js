const User = require('../models/userModel');

exports.registerForm = (req, res) => {
  res.render('register');
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.render('register', { error: 'Email déjà utilisé' });

  const user = new User({ email, password });
  await user.save();
  res.redirect('/login');
};

exports.loginForm = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) return res.render('login', { error: 'Identifiants invalides' });

  req.session.user = {
    id: user._id,
    email: user.email,
    role: user.role
  };
  req.session.cart = user.cart || [];
  res.redirect('/');
};

exports.logout = async (req, res) => {
  const User = require('../models/userModel');
  if (req.session.user) {
    await User.findByIdAndUpdate(req.session.user.id, {
      cart: req.session.cart || []
    });
  }
  req.session.destroy(() => {
    res.redirect('/login');
  });
};