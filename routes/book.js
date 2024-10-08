const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();

const bookControllers = require("../controllers/book");

// Requete GET qui recupére la liste de tout les objets
router.get("/", bookControllers.getAllBook);

// Requete GET pour récupérer un objet par son id
router.get("/:id", bookControllers.getOneBook);

// Requete POST pour creer un nouvel objet
router.post("/", auth, multer, bookControllers.createBook);

// Requete POST pour la notation de livre 
router.post("/:id/rating", auth, bookControllers.ratingBook);

// Requete PUT qui permet de modifier un objet par son id
router.put("/:id", auth, multer, bookControllers.modifyBook);

// Requete DELETE pour supprimer un obet par son id
router.delete("/:id", auth, bookControllers.deleteBook);

module.exports = router;
