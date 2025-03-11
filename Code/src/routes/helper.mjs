// Retourne un objet JSON avec un message et des données
const success = (message, data) => {
  return {
    message: message,
    data: data,
  };
};

// Calcule un nouvel ID unique à partir d'un tableau de produits
const getUniqueId = (products) => {
  // Crée un tableau contenant les ID de tous les produits
  const productsIds = products.map((product) => product.id);
  // Trouve l'ID maximum dans le tableau
  const maxId = productsIds.reduce((a, b) => Math.max(a, b));
  // Retourne l'ID maximum + 1 pour obtenir un nouvel ID unique
  return maxId + 1;
};

export { success, getUniqueId };
