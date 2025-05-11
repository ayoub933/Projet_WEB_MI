# Projet Vente de Produits

## Prérequis

- [MongoDB Compass]
- [MongoDB]
- [Node.js]
- `npm`

## Installation et lancement

### 0. Regarder au préalable la vidéo pour des explications sur le site et ensuite aller au 1.

### 1. Lancer le serveur MongoDB

Assurez-vous que le service MongoDB est en cours d’exécution.  
Si vous utilisez MongoDB localement, vous pouvez le démarrer avec :

```bash
mongod
```

### 2. Ouvrir MongoDB Compass

Lancer MongoDB Compass sur votre machine.

### 3. Créer la base de données

Créer une base de données appelée `vente_produit`.

### 4. Créer les collections

Dans la base `vente_produit`, créer les collections suivantes :

- `users`
- `products`

### 5. Importer les données

Dans la collection `products`, importer le fichier `product.json` qui se trouve à la racine du projet.

### 6. Lancer le serveur

Depuis la racine du projet, ouvrir un terminal et exécuter :

```bash
npm install
```
Lancer cette commande pour lancer le serveur:

```bash
node server.js
```
Si il y a des problèmes de modules exécutez la commande suivante avec le bon nom de module:

```bash
npm install nom_du_module
```

Enfin le lancement du serveur doit afficher normalement:
```
Serveur démarré sur http://localhost:3000
Connecté à MongoDB`
```
Il faut ensuite cliquer sur le lien et l'ouvrir dans votre navigateur pour arriver sur le site
