const express = require("express");
const router = express.Router();
const stuffControllers = require("../controllers/stuff");

// Requete POST pour creer un nouvel objet
router.post("/", stuffControllers.createThing);

// Requete PUT qui permet de modifier un objet par son id
router.put("/:id", stuffControllers.modifyThing);

// Requete DELETE pour supprimer un obet par son id 
router.delete("/:id", stuffControllers.deleteThing);

// Requete GET pour récupérer un objet par son id
router.get("/:id", stuffControllers.getOneThing);

// Requete GET qui recupére la liste de tout les objets
router.get("/", stuffControllers.getAllThing);

module.exports = router;
