const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObjet = JSON.parse(req.body.book);
  delete bookObjet._id;
  delete bookObjet._userId;
  const book = new Book({
    ...bookObjet,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({
        message: "Livre créé !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
    // userId: req.auth.userId,
  })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé !" });
      }
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObjet = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete bookObjet._userId;

  Book.findByIdAndUpdate({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé !" });
      }
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: "Accès non authorisé !" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObjet, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié !" }))
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé !" });
      }
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: "Accès non autorisé !" });
      } else {
        const filename = book.imageUrl.split("images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => {
              res.status(500).json({ error });
            });
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getBestRatingBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trier par note moyenne décroissante
    .limit(3) // Limiter les résultats à 3 livres
    .then((bestRatedBook) => {
      console.log(bestRatedBook);
      res.status(200).json(bestRatedBook);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.ratingBook = (req, res) => {
  let userMessage = ""; // Variable pour stocker les messages spécifiques à l'utilisateur
  //cherche le livre correspondant à l'identifiant
  Book.findByIdAndUpdate({ _id: req.params.id })
    .then((book) => {
      // Vérifie si l'utilisateur a déjà noté le livre
      const existingRating = book.ratings.find(
        (rating) => rating.userId === req.auth.userId
      );
      if (existingRating) {
        // Si l'utilisateur a déjà noté le livre, renvoie un message
        userMessage = "Vous avez déjà noté ce livre.";
        console.log(userMessage);
      } else {
        // Sinon, ajoute une nouvelle note au tableau ratings du livre.
        book.ratings.push({
          userId: req.auth.userId,
          grade: req.body.rating,
        });
        userMessage = "Votre note a été validée."; // Message lorsque l'UI a noté un livre avec succès
        console.log(userMessage);
      }
      //Calcul de la somme des notes - "acc" pour accumulateur (variable utilisée) pour accumuler la somme des notes des évaluations du livre
      let totalRating = book.ratings.reduce(
        (acc, rating) => acc + rating.grade,
        0
      );
      // Calcul de la moyenne des notes et uyilisation méthode "Math.round" pour arrondir à l'entier le plus proche
      book.averageRating = Math.round(totalRating / book.ratings.length);
      console.log(book.averageRating);

      return book.save();
    })
    .then((updatedBook) => {
      return res.status(200).json(updatedBook);
    })
    .catch((error) => {
      // Gestion des erreurs
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    });
};
