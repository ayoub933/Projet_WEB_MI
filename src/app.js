const express = require('express');
const app = express();
const indexRoutes = require('./routes/index');

app.set('view engine', 'ejs');

app.use('/', indexRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
