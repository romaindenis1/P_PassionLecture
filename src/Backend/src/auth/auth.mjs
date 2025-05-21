import jwt from "jsonwebtoken";
import { privateKey } from "./private_key.mjs";

const auth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  const tokenFromHeader = authorizationHeader?.split(" ")[1];
  const tokenFromCookie = req.cookies?.token;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Aucun jeton d'authentification fourni." });
  }

  jwt.verify(token, privateKey, (error, decodedToken) => {
    if (error) {
      return res
        .status(401)
        .json({ message: "Token invalide ou expiré.", data: error });
    }

    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;

    if (req.body.userId && req.body.userId !== userId) {
      return res
        .status(401)
        .json({ message: "L'identifiant de l'utilisateur est invalide" });
    }

    req.userId = userId;
    req.isAdmin = isAdmin;
    next();
  });
};

export { auth };
