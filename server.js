const express = require('express');
const session = require('express-session');
const path = require('path');
const connectedUsers = require('./utils/connectedUsers');
const connectDB = require('./config/db');
connectDB();

const app = express();

// ✅ Session middleware
app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false
}));

// ✅ Middleware global : injecte dans toutes les vues
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.message = req.session.message || null;
    res.locals.connectedCount = connectedUsers.size || 0;
    next();
});

// ✅ Suivi des utilisateurs connectés
app.use((req, res, next) => {
    if (req.session.user) {
        connectedUsers.add(req.session.user.email);
    }
    next();
});

// Middlewares généraux
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use('/', userRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);

// Lancement
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
