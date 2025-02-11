import { Sequelize, DataTypes } from "sequelize";
import { ProductModel } from "../models/products.mjs";
import bcrypt from "bcrypt";
import { UserModel } from "../models/users.mjs";
import { products } from "./mock-product.mjs";

const sequelize = new Sequelize(
  "db_products", // Nom de la DB qui doit exister
  "root", // Nom de l'utilisateur
  "root", // Mot de passe de l'utilisateur
  {
    port: 6033,
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

// Le modèle product
const Product = ProductModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

//Setup db
let initDb = () => {
  return sequelize.sync({ force: true }).then((_) => {
    importProducts();
    importUsers();
    console.log("La base de données db_products a bien été synchronisée");
  });
};

const importUsers = () => {
  bcrypt
    .hash("etml", 10) // temps pour hasher = du sel
    .then((hash) =>
      User.create({
        username: "admin",
        password: hash,
      })
    )
    .then((user) => console.log(user.toJSON()));
};
//fait un gros map et met tout dans .create
const importProducts = () => {
  // import tous les produits présents dans le fichier db/mock-product
  products.map((product) => {
    Product.create({
      name: product.name,
      price: product.price,
    }).then((product) => console.log(product.toJSON()));
  });
};

export { sequelize, initDb, Product, User };
