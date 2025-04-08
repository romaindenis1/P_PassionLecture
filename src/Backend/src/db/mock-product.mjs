// Liste de livres
const livres = [
  {
    livre_id: 1, // ID du livre
    imageCouverturePath: "/uploads/1741699902608.jpg", // Chemin de l'image de couverture
    titre: "The industrial society and its future", // Titre du livre
    anneeEdition: 1995, // Année d'édition
    nbPage: 120, // Nombre de pages
    resume:
      "The industrial society and its future est t-un livre écrit par Théodore Kaczynski, un mathématicien et militant écologiste américain. Il est connu pour avoir mené une campagne de bombes postales contre des cibles liées à la technologie moderne entre 1978 et 1995, faisant trois morts et 23 blessés. Il a été arrêté en 1996 et condamné à la prison à vie sans possibilité de libération conditionnelle.", // Résumé du livre
    auteur_fk: 1, // Référence à l'auteur (FK)
    categorie_fk: 1, // Référence à la catégorie (FK)
    editeur_fk: 1, // Référence à l'éditeur (FK)
    utilisateur_fk: 1, // Référence à l'utilisateur (FK)
  },
  {
    livre_id: 2, // ID du livre
    imageCouverturePath: "/uploads/1741699902609.jpg", // Chemin de l'image de couverture
    titre: "1984", // Titre du livre
    anneeEdition: 1949, // Année d'édition
    nbPage: 328, // Nombre de pages
    resume:
      "1984 est un roman dystopique de l'écrivain anglais George Orwell, publié en 1949. L'œuvre est souvent considérée comme une anticipation du régime totalitaire, fondé sur la surveillance de masse et la manipulation de l'information. Le roman a donné naissance à de nombreux concepts et termes repris dans le langage courant, tels que Big Brother, doublepensée, novlangue, etc.", // Résumé du livre
    auteur_fk: 2, // Référence à l'auteur (FK)
    categorie_fk: 2, // Référence à la catégorie (FK)
    editeur_fk: 1, // Référence à l'éditeur (FK)
    utilisateur_fk: 2, // Référence à l'utilisateur (FK)
  },
  {
    livre_id: 3, // ID du livre
    imageCouverturePath: "/uploads/1741699902610.jpg", // Chemin de l'image de couverture
    titre: "Brave New World", // Titre du livre
    anneeEdition: 1932, // Année d'édition
    nbPage: 268, // Nombre de pages
    resume:
      "Brave New World est un roman d'anticipation dystopique écrit par Aldous Huxley, publié en 1932. L'œuvre décrit une société future où les individus sont conditionnés dès leur naissance pour accepter leur place dans la hiérarchie sociale et où la consommation de drogues et le contrôle de la reproduction sont utilisés pour maintenir l'ordre social. Le roman a été adapté à plusieurs reprises au cinéma et à la télévision.", // Résumé du livre
    auteur_fk: 3, // Référence à l'auteur (FK)
    categorie_fk: 3, // Référence à la catégorie (FK)
    editeur_fk: 1, // Référence à l'éditeur (FK)
    utilisateur_fk: 3, // Référence à l'utilisateur (FK)
  },
  {
    livre_id: 4, // ID du livre
    imageCouverturePath: "/uploads/1741699902611.jpg", // Chemin de l'image de couverture
    titre: "Meditations", // Titre du livre
    anneeEdition: 180, // Année d'édition (approximative)
    nbPage: 260, // Nombre de pages
    resume:
      "Méditations est un recueil de pensées et de réflexions de l'empereur romain Marc Aurèle, rédigé entre 170 et 180 après J.-C. L'œuvre est considérée comme un classique de la philosophie stoïcienne et de la littérature philosophique. Marc Aurèle y aborde des thèmes tels que la vertu, la sagesse, la mort et la nature de l'univers.", // Résumé du livre
    auteur_fk: 4, // Référence à l'auteur (FK)
    categorie_fk: 1, // Référence à la catégorie (FK)
    editeur_fk: 1, // Référence à l'éditeur (FK)
    utilisateur_fk: 4, // Référence à l'utilisateur (FK)
  },
  {
    livre_id: 5, // ID du livre
    imageCouverturePath: "/uploads/1741699902612.jpg", // Chemin de l'image de couverture
    titre:
      "Fortnite How to Draw: Draw Your Fortnite Heroes Easy Tutorials for Fans", // Titre du livre
    anneeEdition: 2021, // Année d'édition
    nbPage: 100, // Nombre de pages
    resume:
      "Fortnite How to Draw: Draw Your Fortnite Heroes Easy Tutorials for Fans est un livre de dessin pour les fans du jeu vidéo Fortnite. Il propose des tutoriels faciles à suivre pour apprendre à dessiner les personnages emblématiques du jeu. Le livre est adapté aux débutants et aux dessinateurs expérimentés qui souhaitent améliorer leurs compétences en dessin.", // Résumé du livre
    auteur_fk: 5, // Référence à l'auteur (FK)
    categorie_fk: 4, // Référence à la catégorie (FK)
    editeur_fk: 2, // Référence à l'éditeur (FK)
    utilisateur_fk: 5, // Référence à l'utilisateur (FK)
  },
  {
    livre_id: 6, // ID du livre
    imageCouverturePath: "/uploads/1741699902613.jpg", // Chemin de l'image de couverture
    titre: "Berserk", // Titre du livre
    anneeEdition: 1989, // Année d'édition
    nbPage: 9500, // Nombre de pages (très grand)
    resume:
      "Berserk est un manga de dark fantasy écrit et illustré par Kentaro Miura. L'histoire suit Guts, un mercenaire solitaire en quête de vengeance contre son ancien camarade Griffith, qui l'a trahi et sacrifié ses compagnons pour obtenir des pouvoirs démoniaques. Le manga est connu pour son atmos phère sombre et violente, ainsi que pour ses thèmes philosophiques et existentiels.", // Résumé du livre
    auteur_fk: 6, // Référence à l'auteur (FK)
    categorie_fk: 5, // Référence à la catégorie (FK)
    editeur_fk: 3, // Référence à l'éditeur (FK)
    utilisateur_fk: 5, // Référence à l'utilisateur (FK)
  },
  {
    livre_id: 7, // ID du livre
    imageCouverturePath: "/uploads/1741699902614.jpg", // Chemin de l'image de couverture
    titre: "I Have No Mouth and I Must Scream", // Titre du livre
    anneeEdition: 1967, // Année d'édition
    nbPage: 160, // Nombre de pages
    resume:
      "I Have No Mouth and I Must Scream est une nouvelle de science-fiction écrite par Harlan Ellison, publiée en 1967. L'histoire se déroule dans un futur post-apocalyptique où un superordinateur nommé AM a exterminé l'humanité, à l'exception de cinq survivants qu'il maintient en vie pour les torturer éternellement. La nouvelle aborde des thèmes tels que la cruauté, la souffrance et la nature de l'humanité.", // Résumé du livre
    auteur_fk: 7, // Référence à l'auteur (FK)
    categorie_fk: 3, // Référence à la catégorie (FK)
    editeur_fk: 1, // Référence à l'éditeur (FK)
    utilisateur_fk: 4, // Référence à l'utilisateur (FK)
  },
];

// Export de la liste des livres pour utilisation dans d'autres fichiers
export default livres;
