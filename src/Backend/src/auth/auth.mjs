// Import de la librairie jsonwebtoken pour gérer la création et la vérification des tokens JWT
import jwt from "jsonwebtoken";

// Import de la clé privée nécessaire pour vérifier l'authenticité du token
import { privateKey } from "./private_key.mjs";

// Middleware d'authentification pour protéger les routes de l'application
const auth = (req, res, next) => {
  // Extraction de l'en-tête d'autorisation depuis la requête HTTP
  const authorizationHeader = req.headers.authorization;
  const tokenFromHeader = authorizationHeader?.split(" ")[1];
  const tokenFromCookie = req.cookies?.token;

  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    const message = "Aucun jeton d'authentification fourni.";
    return res.status(401).json({ message });
  }

  jwt.verify(token, privateKey, (error, decodedToken) => {
    if (error) {
      const message = "Token invalide ou expiré.";
      return res.status(401).json({ message, data: error });
    }

    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      const message = "L'identifiant de l'utilisateur est invalide";
      return res.status(401).json({ message });
    }
    req.userId = decodedToken.userId;

    next();
  });
};

// Export du middleware pour l'utiliser dans d'autres parties de l'application
export { auth };
