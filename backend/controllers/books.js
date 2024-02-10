const Book = require("../models/Book");

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
  book.save()
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
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(400).json({ error });
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

  Book.findByIdAndUpdate ({ _id: req.params.id })
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
      }
      Book.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({ message: "Livre supprimé !" });
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// //FONCTION CI-DESSOUS NE FONCTIONNE PAS !!! JE NAI PAS LES IDEES CLAIRES !!!
exports.getBestRatedBooksForPage = async (req, res, next) => {
  try {
    // Récupérer l'ID du livre actuel depuis les paramètres de la requête
    const currentBookId = req.params.id;

    // Récupérer les évaluations du livre actuel
    const currentBook = await Book.findById(currentBookId);
    const currentBookRatings = currentBook.ratings.map((rating) => rating.userId);

    // Récupérer les 3 livres les mieux notés (à l'exclusion du livre actuel)
    const bestRatedBooks = await Book.find({
      _id: { $ne: currentBookId }, // Exclure le livre actuel
      'ratings.userId': { $nin: currentBookRatings }, // Exclure les utilisateurs qui ont évalué le livre actuel
    })
      .sort({ 'averageRating': -1 }) // Trier par note moyenne décroissante
      .limit(3); // Limiter les résultats à 3 livres

    res.status(200).json(bestRatedBooks);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.ratingBook = (req,res) => {
  let userMessage = ""; // Variable pour stocker les messages spécifiques à l'utilisateur
  //cherche le livre correspondant à l'identifiant
  Book.findByIdAndUpdate({_id: req.params.id})
  .then(book => {
   // Vérifie si l'utilisateur a déjà noté le livre
   const existingRating = book.ratings.find(rating => rating.userId === req.auth.userId);
   if (existingRating) {
     // Si l'utilisateur a déjà noté le livre, renvoie un message
     userMessage = "Vous avez déjà noté ce livre.";
     console.log(userMessage);
   } else {
     // Sinon, ajoute une nouvelle note au tableau ratings du livre
     book.ratings.push({
       userId: req.auth.userId,
       grade: req.body.rating
     });
     userMessage = "Votre note a été validée."; // Message lorsque l'UI a noté un livre avec succès
     console.log(userMessage);
   }
    //Calcul de la somme des notes
    let totalRating = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
    // Calcul de la moyenne des notes
    book.averageRating =Math.round(totalRating / book.ratings.length);
    console.log(book.averageRating);

    return book.save();
  })
  .then(updatedBook => {
    console.log("book saved:", updatedBook);
    //Crée un nouvel objet pour le livre mis à jour
    const newBook={...updatedBook.toObject() };
    newBook._id = updatedBook._id.toString();
  });
};