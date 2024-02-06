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

  Book.findOne({ _id: req.params.id })
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

// ça ne MARCHE PAS ENCORE ! visiblement pb avec id ???
exports.bestRatingBooks = async (req, res, next) => {
  try {
    //méthode "aggregate" pour regrouper et trier les livres par note moyenne
    const bestRatedBooks = await Book.aggregate([
      {
        $project: {
          _id: 1,
          title: 1,
          author: 1,
          imageUrl: 1,
          year: 1,
          genre: 1,
          ratings: 1,
          averageRating: 1,
        },
      },
      {
        $addFields: {
          totalRatings: { $size: "$ratings" },
        },
      },
      {
        $match: {
          totalRatings: { $gt: 0 }, // Filtre les livres avec au moins une note
        },
      },
      {
        $sort: {
          averageRating: -1,
        },
      },
      {
        $limit: 3, // Limite les résultats à 3 livres
      },
    ]);

    res.status(200).json(bestRatedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};