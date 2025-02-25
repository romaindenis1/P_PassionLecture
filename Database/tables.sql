CREATE TABLE t_auteur(
   auteur_id INT AUTO_INCREMENT,
   nom VARCHAR(255) NOT NULL,
   prenom VARCHAR(255) NOT NULL,
   PRIMARY KEY(auteur_id)
);

CREATE TABLE t_categorie(
   categorie_id INT AUTO_INCREMENT,
   libelle VARCHAR(255) NOT NULL,
   PRIMARY KEY(categorie_id),
   UNIQUE(libelle)
);

CREATE TABLE t_utilisateur(
   utilisateur_id INT AUTO_INCREMENT,
   username VARCHAR(50) NOT NULL,
   hashedPassword VARCHAR(255) NOT NULL,
   dateSignup DATETIME NOT NULL,
   isAdmin BOOLEAN NOT NULL,
   PRIMARY KEY(utilisateur_id),
   UNIQUE(username),
   UNIQUE(hashedPassword)
);

CREATE TABLE t_editeur(
   editeur_id INT AUTO_INCREMENT,
   nom VARCHAR(50) NOT NULL,
   PRIMARY KEY(editeur_id)
);

CREATE TABLE t_livre(
   livre_id INT AUTO_INCREMENT,
   imageCouverturePath VARCHAR(255) NOT NULL,
   titre VARCHAR(255) NOT NULL,
   nbPage INT NOT NULL,
   lien VARCHAR(255) NOT NULL,
   resume VARCHAR(3000) NOT NULL,
   anneeEdition TINYINT NOT NULL,
   utilisateur_fk INT NOT NULL,
   editeur_fk INT NOT NULL,
   categorie_fk INT NOT NULL,
   auteur_fk INT NOT NULL,
   PRIMARY KEY(livre_id),
   UNIQUE(lien),
   FOREIGN KEY(utilisateur_fk) REFERENCES t_utilisateur(utilisateur_id),
   FOREIGN KEY(editeur_fk) REFERENCES t_editeur(editeur_id),
   FOREIGN KEY(categorie_fk) REFERENCES t_categorie(categorie_id),
   FOREIGN KEY(auteur_fk) REFERENCES t_auteur(auteur_id)
);

CREATE TABLE t_laisser(
   livre_fk INT,
   utilisateur_fk INT,
   contenu VARCHAR(5000) NOT NULL,
   PRIMARY KEY(livre_fk, utilisateur_fk),
   FOREIGN KEY(livre_fk) REFERENCES t_livre(livre_id),
   FOREIGN KEY(utilisateur_fk) REFERENCES t_utilisateur(utilisateur_id)
);

CREATE TABLE t_apprecier(
   livre_fk INT,
   utilisateur_fk INT,
   note TINYINT NOT NULL,
   PRIMARY KEY(livre_fk, utilisateur_fk),
   FOREIGN KEY(livre_fk) REFERENCES t_livre(livre_id),
   FOREIGN KEY(utilisateur_fk) REFERENCES t_utilisateur(utilisateur_id)
);
