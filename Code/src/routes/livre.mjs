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

livreRouter.get("/:id", async (req, res) => {
  try {
    const book = await Livre.findByPk(req.params.id);
    if (book === null) {
      const message = "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
      return res.status(404).json({ message });
    }

    const message = `Le livre dont l'id vaut ${book.livre_id} a bien été récupéré.`;
    return res.json(success(message, book));

  } catch (error) {
    const message = "Le livre n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
    return res.status(500).json({ message, data: error });
  }
});



livreRouter.get("/:id", (req, res) => {
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

livreRouter.post("/", async (req, res) => {
  try {

    const book = await Livre.create(req.body);

    const message = `Le livre dont le nom est ${book.titre} a bien été créé.`;
    return res.json(success(message, book));

  } catch (error) {
    const message =
      "Le livre n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
    return res.status(500).json({ message, data: error });
  }
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