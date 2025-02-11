import express from "express";
import { sequelize, initDb } from "./db/sequelize.mjs";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.mjs";
//prend la methode de products
import { productsRouter } from "./routes/products.mjs";

// Route pour accéder à la documentation Swagger
//const specs = swaggerJsdoc(options);

const app = express();
const port = 3000;

app.use(express.json());

//Default
app.get("/", (req, res) => {
  res.send("API REST of self service machine !");
});

//redirige /api/ vers localhost 3000
app.get("/api/", (req, res) => {
  res.redirect(`http://localhost:${port}/`);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

//dire que ca marche
app.use("/api/products", productsRouter);
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

import { loginRouter } from "./routes/login.mjs";
app.use("/api/login", loginRouter);

sequelize
  .authenticate()
  .then((_) =>
    console.log("La connexion à la base de données a bien été établie")
  )
  .catch((error) => console.error("Impossible de se connecter à la DB"));

initDb();

app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json(message);
});
