const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const stuffControllers = require("../controllers/stuff");

// Requete GET qui recupére la liste de tout les objets
router.get("/", auth, stuffControllers.getAllThing);

// Requete POST pour creer un nouvel objet
router.post("/", auth, stuffControllers.createThing);

// Requete GET pour récupérer un objet par son id
router.get("/:id", auth, stuffControllers.getOneThing);

// Requete PUT qui permet de modifier un objet par son id
router.put("/:id", auth, stuffControllers.modifyThing);

// Requete DELETE pour supprimer un obet par son id
router.delete("/:id", auth, stuffControllers.deleteThing);

module.exports = router;
