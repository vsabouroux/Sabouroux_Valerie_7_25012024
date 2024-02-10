const express = require("express");
const router = express.Router(); // méthode Router d'express
//"/api/books" = route de base url de base donc on va le remplacer par /
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const booksCtrl = require("../controllers/books");

router.get("/", booksCtrl.getAllBooks);
router.get("/:id", booksCtrl.getOneBook);
// router.get("/bestrating", booksCtrl.getBestRatedBooks);
// Ajoutez cette nouvelle route pour obtenir les 3 livres les mieux notés
router.get("/bestrating", booksCtrl.getBestRatedBooksForPage);
router.post("/", auth, multer, booksCtrl.createBook);
router.put("/:id", auth, multer, booksCtrl.modifyBook)
router.post("/:id/rating", auth, booksCtrl.ratingBook);
router.delete("/:id", auth, booksCtrl.deleteBook);


module.exports = router;
