// Contrôleur principal
exports.home = (req, res) => {
    res.render('layout', { title: 'Accueil', message: 'Bienvenue sur ma page d’accueil !' });
};
