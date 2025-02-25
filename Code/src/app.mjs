import express from "express";
import { sequelize, initDb } from "./db/sequelize.mjs";
//prend la methode de products
import { livreRouter } from "./routes/livre.mjs";
import { loginRouter } from "./routes/login.mjs";


const app = express();
const port = 3000;

app.use(express.json());

//Default
app.get("/", (req, res) => {
  res.send("base page wiorks");
});


app.use("/home", livreRouter);



app.use("/login", loginRouter);

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

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});