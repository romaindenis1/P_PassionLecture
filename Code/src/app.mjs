import express from "express"; // Importer Express pour créer l'application
import swaggerJSDoc from "swagger-jsdoc"; // Générer la documentation Swagger
import swaggerUi from "swagger-ui-express"; // Interface web pour Swagger
import { swaggerSpec } from "./swagger.mjs"; // Configuration Swagger définie dans un fichier externe
import { sequelize, initDb } from "./db/sequelize.mjs"; // Instance Sequelize et fonction d'initialisation de la DB


import { sequelize, initDb } from "./db/sequelize.mjs";
// Importer les routeurs pour chaque ressource
import { livreRouter } from "./routes/livre.mjs";
import { loginRouter } from "./routes/login.mjs";
import { signupRouter } from "./routes/signup.mjs";
import { userRouter } from "./routes/user.mjs";
import { categorieRouter } from "./routes/categories.mjs";
// Options Swagger pour la documentation de l'API

const app = express();
const port = 3000;
app.use(express.json()); // Middleware pour parser le JSON

// Route de base
app.get("/", (req, res) => {
  res.send("Base page works");
});
 
// Routes
app.use("/login", loginRouter);
app.use("/livres", livreRouter);
app.use("/signup", signupRouter);
app.use("/users", userRouter);
app.use("/categories", categorieRouter);

// Lancement du serveur et connexion à la DB
app.listen(port, async () => {
  console.log(`Example app listening on http://localhost:${port}`);

  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie");
  } catch (error) {
    console.error("Impossible de se connecter à la DB :", error);
  }

  await initDb();
});

// Middleware 404 pour les routes non trouvées
app.use((req, res, next) => {
  const message = "Nous n'avons pas pu trouver la page demandée.";
  res.status(404).json({ message });
});

// Middleware global de gestion des erreurs
app.use((error, req, res, next) => {
  console.error("Erreur serveur :", error);
  res.status(500).json({
    message: "Une erreur interne est survenue.",
    error: error.message,
  });
});
