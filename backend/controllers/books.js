const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
  const bookObjet = JSON.parse(req.body.book);
  delete bookObjet._id;
  delete bookObjet._userId;
  const book = new Book({
    ...bookObjet,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  });
  book.save().then(
    () => {
      res.status(201).json({
        message: 'Livre créé !'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.getAllBooks = (req, res, next) => {
    Book.find().then(
      (books) => {
        res.status(200).json(books);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };