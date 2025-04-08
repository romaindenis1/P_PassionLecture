// Import de la librairie jsonwebtoken pour gérer la création et la vérification des tokens JWT
import jwt from "jsonwebtoken";

// Import de la clé privée nécessaire pour vérifier l'authenticité du token
import { privateKey } from "./private_key.mjs";

// Middleware d'authentification pour protéger les routes de l'application
const auth = (req, res, next) => {
  // Extraction de l'en-tête d'autorisation depuis la requête HTTP
  const authorizationHeader = req.headers.authorization;

  // Si l'en-tête est absent, renvoyer une réponse 401 indiquant l'absence de token
  if (!authorizationHeader) {
    const message =
      "Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.";
    return res.status(401).json({ message });
  } else {
    // Extraction du token en supposant le format "Bearer <token>"
    const token = authorizationHeader.split(" ")[1];

    // Vérification et décodage du token à l'aide de la clé privée
    jwt.verify(token, privateKey, (error, decodedToken) => {
      // En cas d'erreur (token invalide, expiré, etc.), renvoyer une réponse 401
      if (error) {
        const message =
          "L'utilisateur n'est pas autorisé à accéder à cette ressource.";
        return res.status(401).json({ message, data: error });
      }
      // Récupération de l'identifiant utilisateur contenu dans le token
      const userId = decodedToken.userId;

      // Si le corps de la requête contient un userId et qu'il ne correspond pas à celui du token, renvoyer une erreur
      if (req.body.userId && req.body.userId !== userId) {
        const message = "L'identifiant de l'utilisateur est invalide";
        return res.status(401).json({ message });
      } else {
        // Si toutes les vérifications sont validées, passer au middleware suivant
        next();
      }
    });
  }
};

// Export du middleware pour l'utiliser dans d'autres parties de l'application
export { auth };
