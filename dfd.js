const fs = require('fs');
const path = require('path');

const projectStructure = {
    'public': ['images.png', 'styles.css', 'scripts.js'],
    'views': ['index.html', 'product.html', 'cart.html', 'login.html', 'register.html'],
    'server': ['routes', 'models', 'config'],
    'server/routes': ['productRoutes.js', 'userRoutes.js'],
    'server/models': ['productModel.js', 'userModel.js'],
    'server/config': ['db.js'],
    'server': ['server.js']
};

function createStructure(basePath, structure) {
    Object.keys(structure).forEach(folder => {
        const folderPath = path.join(basePath, folder);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log(`Dossier créé : ${folderPath}`);
        }
    });
    
    Object.keys(structure).forEach(folder => {
        const folderPath = path.join(basePath, folder);
        structure[folder].forEach(file => {
            const filePath = path.join(folderPath, file);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '');
                console.log(`Fichier créé : ${filePath}`);
            }
        });
    });
}

createStructure(__dirname, projectStructure);
console.log('Structure du projet créée avec succès !');
