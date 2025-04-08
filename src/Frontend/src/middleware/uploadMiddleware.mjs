import multer from "multer"; // Pour gérer les uploads
import path from "path"; // Pour gérer les chemins de fichiers

// Config de stockage pour multer
const storage = multer.diskStorage({
  // Dossier où les fichiers seront enregistrés
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // Nom du fichier: timestamp + extension originale
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Middleware d'upload avec configuration et restrictions
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 3840 * 2160 }, // Limite de taille en octets
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/; // Types de fichiers acceptés
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);
    if (extname && mimeType) {
      return cb(null, true);
    }
    cb(
      new Error("Seulement les fichiers JPEG, JPG webp, ou PNG sont autorisés")
    );
  },
});

// Export du middleware upload
export { upload };
