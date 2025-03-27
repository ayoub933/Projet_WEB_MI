DROP TABLE IF EXISTS panier, articles, utilisateurs CASCADE;

CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,  -- Ajout d'une contrainte UNIQUE si vous voulez des noms uniques
    mot_de_passe VARCHAR(255) NOT NULL,
    argent INT NOT NULL,
    roles INT NOT NULL,
    date_naissance DATE,
    dateinscription DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prix NUMERIC(10,2) NOT NULL,  -- Utilisation de NUMERIC pour gérer des montants décimaux
    taille VARCHAR(100),
    couleur VARCHAR(100),
    lien_image VARCHAR(255) NOT NULL,
    UNIQUE(nom, taille, couleur)  -- Contrainte UNIQUE pour éviter des doublons
);

CREATE TABLE IF NOT EXISTS panier (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    article_id INT NOT NULL,
    quantite INT NOT NULL DEFAULT 1,
    taille VARCHAR(50),
    couleur VARCHAR(50),
    CONSTRAINT fk_utilisateur
        FOREIGN KEY(utilisateur_id) 
        REFERENCES utilisateurs(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_article
        FOREIGN KEY(article_id)
        REFERENCES articles(id)
        ON DELETE CASCADE
);