const express = require("express");
const router = express.Router();// méthode Router d'express
//"/api/books" = route de base url de base donc on va le remplacer par /
const auth = require("../middleware/auth");
const multer = require("..middleware/multer-config");
const booksCtrl = require("../controllers/books");

router.get("/", booksCtrl.getAllBooks);
router.post("/", auth, multer, booksCtrl.createBook);


module.exports = router;