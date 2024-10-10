// Importation de la bibliotheque multer pour gerer le telechargement des fichiers
const multer = require("multer");

/**
 * Définir les types MIME et leurs extensions
 */
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Configuration de Multer pour gerer l'upload des fichiers 
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  // Filtre les fichiers uploadé en fonction de leurs type MIME
  fileFilter: (req, file, cb) => {
    // Vérifie si le type MIME du fichier est valide en le comparant a l'objet MIME_TYPES
    const isValid = !!MIME_TYPES[file.mimetype]; // si le mime existe dans MYM_TYPE isValid passe a true
    // Appelle de la fonction callback avec 'null' pour l'erreur et 'isValid' pour indiquer que le fichier est accepté
    cb(null, isValid);
  },
});

module.exports = upload.single("image");
