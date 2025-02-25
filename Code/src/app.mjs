import express from "express";


import { sequelize, initDb } from "./db/sequelize.mjs";
import { livreRouter } from "./routes/livre.mjs";
import { loginRouter } from "./routes/login.mjs";
import { signupRouter } from "./routes/signup.mjs";
import { userRouter } from "./routes/user.mjs";
 
const app = express();
const port = 3000;
app.use(express.json());
 
// Default route
app.get("/", (req, res) => {
  res.send("Base page works");
});
 
// Routes
app.use("/login", loginRouter);
app.use("/home", livreRouter);
app.use("/signup", signupRouter);
app.use("/user", userRouter);
 
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
 
// Middleware 404
app.use((req, res) => {
  res.status(404).json({
    message:
      "Impossible de trouver la ressource demandée ! Essayez une autre URL.",
  });
});
 
// Middleware de gestion d'erreur globale
app.use((error, req, res, next) => {
  console.error("Erreur serveur :", error);
  res.status(500).json({
    message: "Une erreur interne est survenue.",
    error: error.message,
  });
});