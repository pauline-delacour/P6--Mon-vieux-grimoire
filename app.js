//Importation du module Express
const express = require("express");
//Importation du module qui permet d'analyser les corps des requêtes HTTP
const bodyParser = require("body-parser");
//Importation du module mongoDB
const mongoose = require("mongoose");
//Importation du routeur
const stuffRoutes = require('../Back-End/routes/stuff');
const userRoutes = require('../Back-End/routes/user');

//Connexion a MongoDB avec mongoose
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
    console.log(req.body);
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

// Utilisation du routeur par stuffRoutes
app.use('/api/stuff', stuffRoutes);
//Utilisation du router par userRoutes
app.use('/api/auth', userRoutes);

module.exports = app;
