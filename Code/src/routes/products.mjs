import express from "express";

import { success } from "./helper.mjs";
import { getUniqueId } from "./helper.mjs";
import { livres } from "../db/sequelize.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const livresRouter = express();

livresRouter.get("/", auth, (req, res) => {
  if (req.query.name) {
    if (req.query.name.length < 2) {
      const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 3;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    return Product.findAndCountAll({
      where: { name: { [Op.like]: `%${req.query.name}%` } },
      order: ["name"],
      limit: limit,
    }).then((products) => {
      const message = `Il y a ${products.count} produits qui correspondent au terme de la recherche`;
      res.json(success(message, products));
    });
  }
  Product.findAll({ order: ["name"] })
    .then((products) => {
      const message = "La liste des produits a bien été récupérée.";
      res.json(success(message, products));
    })
    .catch((error) => {
      const message =
        "La liste des produits n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

livresRouter.get("/:id", auth, (req, res) => {
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

livresRouter.post("/", auth, (req, res) => {
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

livresRouter.delete("/:id", auth, (req, res) => {
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

livresRouter.put("/:id", auth, (req, res) => {
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

export { livresRouter };