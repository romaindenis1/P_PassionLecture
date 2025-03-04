import express from "express";


import { sequelize, initDb } from "./db/sequelize.mjs";
import { livreRouter } from "./routes/livre.mjs";
import { loginRouter } from "./routes/login.mjs";
import { signupRouter } from "./routes/signup.mjs";
import { userRouter } from "./routes/user.mjs";
import { categorieRouter } from "./routes/categories.mjs";

const app = express();
const port = 3000;
app.use(express.json());
 
// Default route
app.get("/", (req, res) => {
  res.send("Base page works");
});
 
// Routes
app.use("/login", loginRouter);
app.use("/livres", livreRouter);
app.use("/signup", signupRouter);
app.use("/users", userRouter);
app.use("/categories", categorieRouter);
// Lancement du serveur
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
 
// Middleware 404 - Capture toutes les routes non trouvées
app.use((req, res, next) => {
  const message = "Nous n'avons pas pu trouver la page demandée.";
  res.status(404).json({ message });
});

 
// Middleware de gestion d'erreur globale
app.use((error, req, res, next) => {
  console.error("Erreur serveur :", error);
  res.status(500).json({
    message: "Une erreur interne est survenue.",
    error: error.message,
  });
});