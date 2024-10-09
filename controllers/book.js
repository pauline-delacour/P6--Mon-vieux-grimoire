// Importation du modéle Book 
const Book = require("../models/Book");
//Importation de sharp qui va permettre de compresser les images
const sharp = require("sharp");
//Importation du module fs(file system) permet d'interagir avec le systeme de fichier de l'ordinateur
const fs = require("fs");



//Fonction createBook pour creer et enregistrer un nouvel objet Book
exports.createBook = (req, res, next) => {
  // Creation du dossier images s'il n'existe pas
  fs.access("./images", (error) => {
    if (error) {
      fs.mkdirSync("./images");
    }
  });
  // Recupérer le fichier le contenue du fichier(buffer) et originalname (le nom du fichier)
  const { buffer, originalname } = req.file;
  //Generer un timestamp
  const timestamp = new Date().toISOString();
  // grace au timestamp et au nom orignal on va generer un nom de fichier
  const nameimage = `${timestamp}-${originalname}.webp`;
  // sharp pour compresser une image en webp et l'ecrire dans le dossier image
  sharp(buffer)
    .webp({ quality: 20 })
    .toFile("./images/" + nameimage)
    .then(() => {
      const bookObject = JSON.parse(req.body.book);
      delete bookObject._id;
      delete bookObject._userId;
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${nameimage}`,
        averageRating: 0, // Initialisation de averageRating a 0
        rating: [],
      });

      book
        .save()
        .then(() => res.status(201).json({ message: "objet enregistré" }))
        .catch((error) => res.status(400).json({ message: error.message }));
    })
    .catch((error) => res.status(400).json({ message: error.message }));
};

//Fonction ratingBook gere la notation de livre
exports.ratingBook = (req, res, next) => {
  const userId = req.auth.userId;
  // Extraction de l'element rating dans le body de la requete
  const { rating } = req.body;

  if (rating < 0 || rating > 5) {
    res
      .status(400)
      .json({ message: "La note doit etre comprise entre 0 et 5" });
  } else {
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        // Parcours chaque rating , verifie s'il y a deja une note associé a l'utilisateur sinon on creer une note
        const userRating = book.ratings.find(
          (element) => element.userId === userId
        );
        if (userRating) {
          res.status(403).json({ message: "Note deja enregistré" });
        } else {
          const newRating = {
            userId: userId,
            grade: rating,
          };
          book.ratings.push(newRating);

          // Mettre a jour la moyenne
          const totalRatings = book.ratings.length;
          let totalSomme = 0;
          //Boucler sur chaque ratings pour recupéré le score et ajouter chaque note a la somme totale
          book.ratings.forEach((ratingObjet) => {
            totalSomme += ratingObjet.grade;
          });
          //calculer la moyenne 
          book.averageRating = totalSomme / totalRatings; 

          // Sauvegarder les modifications dans la base de données 
          book
            .save()
            .then(() => res.status(200).json(book))
            .catch((error) => res.status(400).json({ message: error.message }));
        }
      })
      .catch((error) => res.status(400).json({ message: error.message }));
  }
};

//Fonction modifyBook pour mettre à jour un objet Book existant par son id
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        // permet de reconstruire l'adresse URL compléte du fichier enregistré
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; // décompose toutes les propriétés et valeur de req.body pour les mettres dans un nouvel objet

  //suppression de l'attribut _userId  et du ratings de l'objet bookobjet pour eviter qu'il soit modifié
  delete bookObject._userId;
  delete bookObject.ratings;
  // Recherce du livre par son Id dans la base de données
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      //Verifie sur l'utilisation et bien le propriétaire du livre
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Non autorisé !" });
      } else {
        //Si le livre est bien a l'utilisateur mettre a jour le livre avec les nouvelles données
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Book modifié" }))
          .catch((error) => res.status(400).json({ message: error.message }));
      }
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
};

// Fonction deleteBook pour supprimer un objet Book par son id
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Non-autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé" });
            })
            .catch((error) => res.status(401).json({ message: error.message }));
        });
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
};

//Fonction getOneBook pour recupérer un objet Book en particulier par son id
exports.getOneBook = (req, res, next) => {
  console.log(req.params);
  //trouver le Book unique ayant le meme id que le parametre de la requête
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ message: error.message }));
};

//Fonction getAllBook pour recupérer tous les objets Book
exports.getAllBook = (req, res, next) => {
  Book.find()
    .then((books) => {
      console.log(books);
      res.status(200).json(books);
    })
    .catch((error) => res.status(400).json({ message: error.message }));
};

//Fonction bestRating pour recupérer les 3 livres les mieux notés
exports.bestRating = (req, res, next ) => {
  Book.find()
  .limit(3)
  .sort({averageRating: -1})
  .then((books)=> {
    res.status(200).json(books);  
  })
  .catch ((error) => res.status(400).json({ message : error.message}));
}