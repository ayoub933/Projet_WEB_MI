// backend/serverController.js
const db = require('./database');
const bcrypt = require('bcrypt');

const loginGet = (req, res) => {
  // Tu peux renvoyer une page HTML statique ou utiliser un moteur de vues
  res.sendFile(require('path').join(__dirname, '../frontend/connexion.html'));
};

const loginPost = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // Remplace cette logique par celle qui convient à ton projet (par exemple, en consultant ta base)
    const { rows } = await db.query('SELECT * FROM utilisateurs WHERE nom = $1', [username]);
    const user = rows[0];
    if (!user) {
      return res.redirect('/connexion?error=Utilisateur non trouvé');
    }
    const match = await bcrypt.compare(password, user.mot_de_passe);
    if (!match) {
      return res.redirect('/connexion?error=Mot de passe incorrect');
    }
    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

module.exports = { loginGet, loginPost };
