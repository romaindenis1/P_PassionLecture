import jwt from "jsonwebtoken"; // Importer jsonwebtoken pour la gestion des tokens JWT
import { privateKey } from "./private_key.mjs"; // Importer la clé privée pour la vérification du token

// Middleware d'authentification pour protéger les routes
const auth = (req, res, next) => {
  // Récupérer l'en-tête d'autorisation depuis la requête
  const authorizationHeader = req.headers.authorization;

  // Si l'en-tête d'autorisation est absent, retourner une réponse 401
  if (!authorizationHeader) {
    const message =
      "Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.";
    return res.status(401).json({ message });
  } else {
    // Extraire le token de l'en-tête (en supposant le format "Bearer <token>")
    const token = authorizationHeader.split(" ")[1];

    // Vérifier et décoder le token avec la clé privée
    jwt.verify(token, privateKey, (error, decodedToken) => {
      // Si une erreur survient lors de la vérification, retourner une réponse 401
      if (error) {
        const message =
          "L'utilisateur n'est pas autorisé à accéder à cette ressource.";
        return res.status(401).json({ message, data: error });
      }
      // Récupérer l'identifiant de l'utilisateur contenu dans le token
      const userId = decodedToken.userId;

      // Si le corps de la requête contient un userId et qu'il ne correspond pas à celui du token, retourner une réponse 401
      if (req.body.userId && req.body.userId !== userId) {
        const message = "L'identifiant de l'utilisateur est invalide";
        return res.status(401).json({ message });
      } else {
        // Si tout est correct, passer au middleware suivant
        next();
      }
    });
  }
};

export { auth }; // Exporter le middleware d'authentification
