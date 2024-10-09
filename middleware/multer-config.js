// Importation de la bibliotheque multer pour gerer le telechargement des fichiers
const multer = require("multer");

// Définir les types MIME et leurs extensions
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};


// Configuration du chemin et le nom de fichier pour les fichiers entrants
const storage = multer.memoryStorage();

module.exports = multer({ storage }).single("image");
