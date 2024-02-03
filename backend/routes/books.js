const express = require("express");
const router = express.Router();// méthode Router d'express
//"/api/books" = route de base url de base donc on va le remplacer par /
const booksCtrl = require("../controllers/books");

router.post("/", booksCtrl.createBook);
router.get("/", booksCtrl.getAllBooks);

module.exports = router;