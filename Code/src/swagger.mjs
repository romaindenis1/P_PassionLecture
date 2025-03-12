import swaggerJSDoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API P_WEB295",
      version: "1.0.0",
      description:
        "API REST permettant de gérer des un site de livres en ligne",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Livre: {
          type: "object",
          required: ["titre", "auteur", "categorie", "anneeEdition", "nbPage"],
          properties: {
            titre: {
              type: "string",
              description: "Le titre du livre",
              example: "Gatsby le Magnifique",
            },
            auteur: {
              type: "string",
              description: "L'auteur du livre",
              example: "F. Scott Fitzgerald",
            },
            categorie: {
              type: "string",
              description: "La catégorie du livre",
              example: "Littérature",
            },
            anneeEdition: {
              type: "integer",
              description: "L'année de publication du livre",
              example: 1925,
            },
            nbPage: {
              type: "integer",
              description: "Le nombre de pages du livre",
              example: 218,
            },
            imageCouverturePath: {
              type: "string",
              description: "Le chemin de l'image de couverture du livre",
              example: "/uploads/1634108505370.jpg",
            },
            resume: {
              type: "string",
              description: "Un résumé du livre",
              example:
                "Un roman racontant l'histoire de Jay Gatsby, un homme mystérieux et riche.",
            },
          },
        },
      },
    },
    paths: {
      "/livres": {
        get: {
          summary: "Récupérer la liste des livres",
          description: "Retourne une liste de tous les livres disponibles.",
          tags: ["Livres"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "Succès - Liste des livres",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Livre",
                    },
                  },
                },
              },
            },
            401: {
              description: "Non autorisé - JWT manquant ou invalide",
            },
            500: {
              description: "Erreur interne du serveur",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./Code/src/routes/*.mjs"],
};

export default options;

const swaggerSpec = swaggerJSDoc(options);
export { swaggerSpec };
