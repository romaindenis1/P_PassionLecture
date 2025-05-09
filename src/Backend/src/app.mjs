import express from "express"; // Importer Express pour créer l'application
import swaggerJSDoc from "swagger-jsdoc"; // Générer la documentation Swagger
import swaggerUi from "swagger-ui-express"; // Interface web pour Swagger
import { swaggerSpec } from "./swagger.mjs"; // Configuration Swagger définie dans un fichier externe
import { sequelize, initDb } from "./db/sequelize.mjs"; // Instance Sequelize et fonction d'initialisation de la DB
import cookieParser from "cookie-parser";

import cors from "cors";

// Importer les routeurs pour chaque ressource
import { livreRouter } from "./routes/livre.mjs";
import { loginRouter } from "./routes/login.mjs";
import { signupRouter } from "./routes/signup.mjs";
import { userRouter } from "./routes/user.mjs";
import { categorieRouter } from "./routes/categories.mjs";
import { auteurRouter } from "./routes/auteur.mjs";

// Options Swagger pour la documentation de l'API
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Livre",
      version: "1.0.0",
      description: "API pour gérer une bibliothèque de livres.",
    },
    servers: [
      {
        url: `http://localhost:3000`, // URL du serveur
      },
    ],
  },
  apis: ["./routes/*.mjs"], // Chemin vers les fichiers de documentation des routes
};

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // autorise les requêtes depuis le frontend Vue.js
    credentials: true,
  })
);

app.use(cookieParser());

const port = 3000;
app.use(express.json()); // Middleware pour parser le JSON

// Route de base
app.get("/", (req, res) => {
  res.send("L'API est lancé");
});

// Configuration de Swagger UI pour accéder à la doc
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

// Utilisation des routeurs pour chaque ressource
app.use("/login", loginRouter);
app.use("/livres", livreRouter);
app.use("/signup", signupRouter);
app.use("/users", userRouter);
app.use("/categories", categorieRouter);
app.use("/auteurs", auteurRouter);

app.use("/uploads", express.static("uploads"));

// Lancement du serveur et connexion à la DB
app.listen(port, "0.0.0.0", async () => {
  console.log(`Example app listening on http://localhost:${port}`);

  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie");
  } catch (error) {
    console.error("Impossible de se connecter à la DB :", error);
  }

  await initDb();
});

app.post("/logout", (req, res) => {
  res.clearCookie("token"); // Supprime le cookie nommé 'token'
  res.status(200).json({ message: "Déconnecté avec succès" });
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
