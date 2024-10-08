//Importation du module Express
const express = require("express");
//Importation du module qui permet d'analyser les corps des requêtes HTTP
const bodyParser = require("body-parser");
//Importation du module mongoDB
const mongoose = require("mongoose");
//Importation du routeur
const bookRoutes = require('../Back-End/routes/book');
const userRoutes = require('../Back-End/routes/user');
//Acceder au path server
const path = require('path');
require ('dotenv').config();

//Connexion a MongoDB avec mongoose
mongoose
  .connect(
    process.env.MONGOOSE
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Création d'une instance de l'application express
const app = express();

// Utilisation d'un middleware pour configurer les en-têtes(CORS)
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
//gestion des images static, permet aux utilisateurs d'acceder au fichier d'images depuis l'URL
app.use('/images', express.static(path.join(__dirname, 'images')));
console.log((path.join(__dirname, 'images')));
// Utilisation du routeur par bookRoutes
app.use('/api/books', bookRoutes);
//Utilisation du router par userRoutes
app.use('/api/auth', userRoutes);

module.exports = app;
