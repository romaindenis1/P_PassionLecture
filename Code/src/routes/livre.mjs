import express from "express";
import { Sequelize } from "sequelize";
import { LivreModel } from "../db/sequelize.mjs";
import { success } from "./helper.mjs";
import { getUniqueId } from "./helper.mjs";
import { livres } from "../db/sequelize.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
import { sequelize } from "../db/sequelize.mjs";

const livreRouter = express();
const Livre = LivreModel(sequelize, Sequelize.DataTypes);

livreRouter.get("/", async (req, res) => {
  try {
    // Query the last 5 books
    const books = await Livre.findAll({
      order: [['createdAt', 'DESC']], // Adjust if necessary (createdAt might not be part of your model)
      limit: 5, 
    });
    const message = "Les 5 livres ont été recuperes !"
    res.json(success(message, books));

    console.log(books.map(book => book.toJSON())); // Log the books as JSON for debugging
    return res.render('index', { books }); // Render EJS view and pass books to it
  } catch (error) {
    console.error("Error fetching last 5 books:", error);
    return res.status(500).json({ error: "Error fetching books" });
  }
});


livreRouter.get("/:id", auth, (req, res) => {
  Product.findByPk(req.params.id)
    .then((product) => {
      if (product === null) {
        const message =
          "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message });
      }
      const message = `Le produit dont l'id vaut ${product.id} a bien été récupéré.`;
      res.json(success(message, product));
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

livreRouter.post("/", auth, (req, res) => {
  Product.create(req.body)
    .then((createdProduct) => {
      const message = `Le produit ${createdProduct.name} a bien été créé !`;
      res.json(success(message, createdProduct));
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

livreRouter.delete("/:id", auth, (req, res) => {
  Product.findByPk(req.params.id)
    .then((deletedProduct) => {
      if (deletedProduct === null) {
        const message =
          "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message });
      }
      return Product.destroy({
        where: { id: deletedProduct.id },
      }).then((_) => {
        const message = `Le produit ${deletedProduct.name} a bien été supprimé !`;
        res.json(success(message, deletedProduct));
      });
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

livreRouter.put("/:id", auth, (req, res) => {
  const productId = req.params.id;
  Product.update(req.body, { where: { id: productId } })
    .then((_) => {
      return Product.findByPk(productId).then((updatedProduct) => {
        if (updatedProduct === null) {
          const message =
            "Le produit demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          return res.status(404).json({ message });
        }
        const message = `Le produit ${updatedProduct.name} dont l'id vaut ${updatedProduct.id} a été mis à jour avec succès`;
        res.json(success(message, updatedProduct));
      });
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { livreRouter };