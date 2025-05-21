// Liste des utilisateurs
const utilisateurs = [
  {
    utilisateur_id: 1, // ID de l'utilisateur
    username: "Xx_ThéodoreGAMING69420_xX", // Nom d'utilisateur
    hashedPassword: "A", // Mot de passe hashé (vide pour l'instant)
    dateSignup: "2021-01-01", // Date d'inscription
    isAdmin: true, // L'utilisateur est administrateur
  },
  {
    utilisateur_id: 2,
    username: "UrLocalBartender",
    hashedPassword: "B",
    dateSignup: "1970-09-04",
    isAdmin: false,
  },
  {
    utilisateur_id: 3,
    username: "Captain_Peru",
    hashedPassword: "C",
    dateSignup: "2025-02-26",
    isAdmin: false,
  },
  {
    utilisateur_id: 4,
    username: "SuperMegaUltraGigaChad",
    hashedPassword: "D",
    dateSignup: "0000-01-01",
    isAdmin: false,
  },
  {
    utilisateur_id: 5,
    username: "TheVoicesInMyHead",
    hashedPassword: "E",
    dateSignup: "2020-12-05",
    isAdmin: false,
  },
  {
    utilisateur_id: 6,
    username: "admin",
    hashedPassword:
      "$2b$10$Ed1ajiTpm9eQjl24JbTsfuXOICrax6zmAP64Rdc37LxY8VXErFjYe",
    dateSignup: "2025-05-21",
    isAdmin: true,
  },
  {
    utilisateur_id: 7,
    username: "root",
    hashedPassword:
      "$2b$10$Sqr93tfq4ysDhoyp1WEbMO138CjNar84cWURHhDuVzZDQkrB3eMSi",
    dateSignup: "2025-05-21",
    isAdmin: false,
  },
];

// Export de la liste des utilisateurs
export default utilisateurs;
