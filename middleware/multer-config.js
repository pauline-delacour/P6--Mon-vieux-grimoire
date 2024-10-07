// Importation de la bibliotheque multer pour gerer le telechargement des fichiers
const multer = require("multer");

// Définir les types MIME et leurs extensions
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration du chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
    //Le fichier destination la ou seront envoyé les fichiers telechargées 
  destination: (req, file, callback) => {
    // les fichiers seront enregistré dans le dossier image
    callback(null, "images");
  },
  
  filename: (req, file, callback) => {
    //Remplace les espaces dans le nom original du fichier par des underscores
    const name = file.originalname.split(" ").join("_");
    //Recupére l'extension correpondante a partir du type MIME du fichier 
    const extension = MIME_TYPES(file.mimetype);
    // Crée un noù de fichier unique en ajoutant un timestamp (date.now()) pour garantir l'unicité du nom + ajout de l'extension appropriée
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
