//Importation du module Express
const express = require("express");
//Importation du module qui permet d'analyser les corps des requetes HTTP
const bodyParser = require("body-parser");
//Importation du module mongoDB
const mongoose = require("mongoose");
//Importation du model Thing
const Thing = require("./models/Thing");
mongoose
  .connect(
    "mongodb+srv://paulinedelacour33:9U3Zm1X4HAxKj3ot@cluster0.jg2td.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Création d'une instance de l'application express
const app = express();

// Utilisation d'un middleware pour configurer les en-têtes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//intercepte toute les requetes qui contiennent un contenType json
app.use(bodyParser.json());

// Requete post
app.post("/api/livre", (req, res, next) => {
  delete req.body.id;
  const thing = new Thing({
    ...req.body,
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "objet enregistré" }))
    .catch((error) => res.status(400).json({ error }));
});

// Requete put qui permet de modifier
app.put("/api/livre/:id", (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié" }))
    .catch((error) => res.status(400).json({ error }));
});
// Requete delete 
app.delete("/api/livre/:id", (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé" }))
    .catch((error) => res.status(400).json({ error }));
});

// Requete get individuelle
app.get("/api/livre/:id", (req, res, next) => {
  //trouver le thing unique ayant le meme id que le parametre de la requête
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
});

// Requete get qui recupére la liste de tout les élements
app.get("/api/livre", (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
});
// //Fonction qui intercepte les requêtes
// app.use((req, res) => {
//   res.json({ message: "Votre requete a bien été recu" });
// });

module.exports = app;
