
---

## **🌍 Vue d’ensemble de la structure**
Ton projet est divisé en **trois parties principales** :
1. **Frontend (public + views)** → Ce que l’utilisateur voit  
2. **Backend (server)** → La logique du site  
3. **Base de données (MySQL ou MongoDB)** → Où sont stockées les infos  

---

# **1️⃣ FRONTEND – Ce que l’utilisateur voit**
📁 **`public/`** → Contient **les fichiers statiques** du site  
📁 **`views/`** → Contient **les pages HTML** du site  

## **📁 `public/`**
| Fichier | Rôle |
|---------|------|
| `styles.css` | Gère l'apparence du site (couleurs, tailles, positionnement, animations, etc.) |
| `scripts.js` | Gère l'interactivité (ajouter au panier, afficher des infos dynamiques, etc.) |
| `images/` | Contient toutes les images du site (produits, logo, icônes, etc.) |

➡️ **Comment ça marche ?**  
- `styles.css` est lié dans `<head>` de chaque page HTML pour que tout le site ait le même style  
- `scripts.js` est lié en bas de `<body>` pour rendre les pages interactives  

---

## **📁 `views/`**
| Fichier | Rôle |
|---------|------|
| `index.html` | Page d’accueil avec la liste des produits |
| `product.html` | Page d’un produit avec ses détails |
| `cart.html` | Page du panier avec tous les articles ajoutés |
| `login.html` | Page de connexion utilisateur |
| `register.html` | Page d’inscription utilisateur |

➡️ **Comment ça marche ?**  
Quand l’utilisateur visite le site :  
- Il commence sur `index.html`  
- Il clique sur un article et est redirigé vers `product.html`  
- Il ajoute un article au panier, et les infos sont stockées dans `localStorage` ou envoyées au backend  
- Il peut aller sur `cart.html` pour voir ce qu’il a ajouté  
- Il peut se connecter via `login.html` ou s’inscrire sur `register.html`  

---

# **2️⃣ BACKEND – La logique du site**
📁 **`server/`** → Contient **tout le code qui gère les actions du site**  

## **📁 `server/`**
| Fichier / Dossier | Rôle |
|-------------------|------|
| `server.js` | Fichier principal qui lance le serveur et connecte tout |
| 📁 `routes/` | Contient les **routes** du site (définit comment le backend répond aux requêtes) |
| 📁 `models/` | Contient les **modèles** (définit la structure des données dans la base) |
| 📁 `config/` | Contient la **configuration**, notamment la connexion à la base de données |

---

## **📜 `server.js` – Le cœur du serveur**
👉 C’est le **fichier principal** qui :  
✔️ Lance le serveur  
✔️ Connecte la base de données  
✔️ Gère les requêtes venant du frontend  
✔️ Charge les routes pour les produits et utilisateurs  

### ✨ Fonctionnement :
1. Il importe **Express** (le framework qui permet de créer un serveur)
2. Il configure **les middlewares** (pour gérer les requêtes, la sécurité, etc.)
3. Il charge les routes des produits et des utilisateurs
4. Il démarre le serveur et écoute sur un port (ex: `localhost:5000`)

**Exemple d’utilisation** :  
Si un utilisateur demande la liste des produits (`GET /api/products`), **server.js** envoie la requête à `productRoutes.js` qui va chercher les données et les renvoyer.

---

## **📁 `server/routes/` – Les routes (API)**
👉 **Les routes permettent au frontend de communiquer avec le backend.**  

| Fichier | Rôle |
|---------|------|
| `productRoutes.js` | Gère les requêtes liées aux produits (ex: afficher la liste, ajouter un produit, etc.) |
| `userRoutes.js` | Gère les requêtes liées aux utilisateurs (ex: inscription, connexion, etc.) |

**Exemple** :  
Si un utilisateur va sur `index.html`, JavaScript envoie une requête **GET** à `http://localhost:5000/api/products`.  
➡️ `server.js` redirige la requête vers `productRoutes.js`  
➡️ `productRoutes.js` récupère les produits dans la base et les envoie au frontend  

---

## **📁 `server/models/` – Les modèles de données**
👉 **Les modèles définissent la structure des données dans la base de données.**  

| Fichier | Rôle |
|---------|------|
| `productModel.js` | Définit comment les produits sont stockés dans la base |
| `userModel.js` | Définit comment les utilisateurs sont stockés dans la base |

**Exemple de `productModel.js` :**  
```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    stock: { type: Number, default: 10 }
});

module.exports = mongoose.model('Product', productSchema);
```
✅ Ça veut dire que chaque produit **doit avoir un nom et un prix**, et peut avoir une image et un stock.  

---

## **📁 `server/config/` – La configuration**
👉 **Ce dossier contient la configuration du serveur et de la base de données.**  

| Fichier | Rôle |
|---------|------|
| `db.js` | Gère la connexion à la base de données |

**Exemple `db.js` (connexion MongoDB) :**  
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connecté à MongoDB");
    } catch (error) {
        console.error("❌ Erreur de connexion à MongoDB", error);
        process.exit(1);
    }
};

connectDB();
module.exports = mongoose;
```
✅ Ça permet de **connecter MongoDB** au projet pour stocker les produits et les utilisateurs.

---

# **3️⃣ BASE DE DONNÉES – Où sont stockées les infos**
On peut utiliser **MongoDB** ou **MySQL**.  
💡 **MongoDB** est une base **NoSQL** (données stockées sous forme de documents JSON).  
💡 **MySQL** est une base **relationnelle** (données organisées en tableaux).  

Dans **MongoDB**, chaque produit est stocké comme ceci :
```json
{
    "_id": "65b7c14d8f8a5a0012a3e27b",
    "name": "T-shirt Mode",
    "price": 19.99,
    "image": "/public/images/1.png",
    "stock": 10
}
```

---

# **📌 Comment tout fonctionne ensemble ?**
1️⃣ **L’utilisateur arrive sur `index.html`** → JavaScript demande la liste des produits à `/api/products`  
2️⃣ **Le backend (`server.js`) intercepte la requête** et l’envoie à `productRoutes.js`  
3️⃣ **Le backend récupère les produits depuis MongoDB** et les renvoie au frontend  
4️⃣ **Le frontend affiche les produits** dans la page `index.html`  

---

# **📌 Prochaine étape ?**
Tu peux maintenant :
✅ Compléter les fichiers avec les fonctionnalités manquantes (`# TODO`)  
✅ Tester le backend (`server.js`) avec **Postman ou un navigateur**  
✅ Connecter le frontend et le backend  

Besoin d’un guide pour la suite ? 🚀