// Importation du module Express
const express = require("express");
//
const bodyParser = require("body-parser");
//Importation du module mongoDB
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://paulinedelacour33:9U3Zm1X4HAxKj3ot@cluster0.jg2td.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Création d'une instance de l'application express
const app = express();

// Utilisaation d'un middleware pour configurer les en-têtes
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

//intercepte toute les requetes qui contient un contenType json
app.use(bodyParser.json());


//   app.post('/api/stuff', (req, res, next) => {
//     console.log(req.body);
//     res.status(201).json({
//       message: 'Objet créé !'
//     });
//   });

//   app.get('/api/stuff', (req, res, next) => {
//     const stuff = [
//         {
//             _id:'userpaulinedelacour',

//     } ]
//   })
//Fonction qui intercepte les requêtes
app.use((req, res) => {
  res.json({ message: "Votre requete a bien été recu" });
});

module.exports = app;
