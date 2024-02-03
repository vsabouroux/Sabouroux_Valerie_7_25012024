const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
  const book = new Book({
    userId: req.body.userId,
    title: req.body.title,
    author : req.body.author,
    imageUrl: req.body.imageUrl,
    year:req.body.year,
    genre:req.body.genre,
    ratings:[{
        userId:req.body.userId,
        grade: req.body.grade,
    }],
    averageRating: req.body.averageRating
  });
  thing.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully !'
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
    Thing.find().then(
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