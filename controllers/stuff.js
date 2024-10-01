// Importation du modéle Thing qui représente un modele mongoose 
const Thing = require("../models/Thing");

//Exportation de la fonction createThing pour creer et enregistrer un nouvel objet Thing
exports.createThing = (req, res, next) => {
    console.log(req.body);
  delete req.body.id;
  const thing = new Thing({
    ...req.body,
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "objet enregistré" }))
    .catch((error) => res.status(400).json({ error }));
};
//Exportation de la fonction modifyThing pour mettre à jour un objet Thing existant par son id
exports.modifyThing = (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié" }))
    .catch((error) => res.status(400).json({ error }));
};
// Exportation de la fonction deleteThing pour supprimer un objet Thing par son id 
exports.deleteThing = (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Objet supprimé" }))
      .catch((error) => res.status(400).json({ error }));
  }
//Exportation de la fonction getOneThing pour recupérer un objet Thing en particulier par son id
  exports.getOneThing = (req, res, next) => {
    console.log(req.params)
    //trouver le thing unique ayant le meme id que le parametre de la requête
    Thing.findOne({ _id: req.params.id })
      .then((thing) => res.status(200).json(thing))
      .catch((error) => res.status(404).json({ error }));
  }
//Exportation de la fonction getAllThing pour recupérer tous les objets Thing
  exports.getAllThing = (req, res, next) => {
    console.log(req);
    Thing.find()
      .then((things) => {
        console.log(things);
        res.status(200).json(things)
      })
      .catch((error) => res.status(400).json({ error }));
  }