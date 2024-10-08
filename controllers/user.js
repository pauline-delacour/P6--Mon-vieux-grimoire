const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Création de compte
exports.signup = (req, res, next) => {
  // Utilisation de bcrypt pour hasher le mot de passe de l'utilisateur
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      //Création d'un nouvel Objet User avec email et password hashé 
      const user = new User({
        email: req.body.email, // Récupération du mail dans le corps de la requete
        password: hash,
      });
      user
        .save() //Methode pour enregistrer le nouvel utilisateur 
        .then(() => res.status(201).json({ message: "Utilisateur Créé!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error });
    });
};

// Authentification
exports.login = (req, res, next) => {
  // Recherche d'utilisateur dans la base de données MondoDB qui a l'email fourni par l'utilisateur
  User.findOne({ email: req.body.email })
    .then((user) => {
      //Si aucun utilisateur correspond a cet email on renvoie une erreur 401
      if (user === null) {
        res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe incorrect" });
      } else {
        // Si l'utilisateur est trouvé on utilise la fonction compare de bcrypt qui compare le mot de passe (string) entré par l'utilisation avec le hash enregistré dans la base de données
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              // Si le mot de passe ne correspond pas une erreur 401 est renvoyé
              res
                .status(401)
                .json({ message: "Paire identifiant/mot de passe incorrect" });
            } else {
              // Si le mot de passe est correct une reponse 200 est renvoyé contenant l'id utilisateur et un token
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  "RANDOM_TOKEN_SECRET",
                  { expiresIn: "24h" }
                ),
              });
            }
          })
          //Si il y a une erreur dans la comparaison on envoie une erreur 500 (erreur server)
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error });
          });
      }
    })
    //S'il y a une erreur lors de la recherche utilisateur on renvoie une erreur 500
    .catch((error) => {
      res.status(500).json({ error });
    });
};
