const express = require('express');
const session = require('express-session');
const path = require('path');
const connectedUsers = require('./utils/connectedUsers');
const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false
}));

const User = require('./models/userModel'); 

app.use(async (req, res, next) => {
    if (req.session.user) {
        const user = await User.findById(req.session.user.id);
        if (user) {
            res.locals.user = {
                id: user._id,
                email: user.email,
                role: user.role,
                money: user.money
            };
        } else {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }

    res.locals.message = req.session.message || null;
    res.locals.connectedCount = connectedUsers.size || 0;
    next();
});


app.use((req, res, next) => {
    if (req.session.user) {
        connectedUsers.add(req.session.user.email);
    }
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use('/', userRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
