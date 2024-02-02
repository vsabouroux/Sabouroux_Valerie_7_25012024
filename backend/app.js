const express = require("express");
const bodyParser = require("body-parser");
const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

const mongoose = require("mongoose");

const Book = require("./models/Book");
// const User = require(".") IMORTER LE CHEM POUR USER

const app = express();
// app.use(express.json()); //ou avec bodyParser pour accéder au coeur de la requete
// avec "next" on passe de middleware au middleware suivant
//Headers pour éviter des erreurs "CORS" Cela va permettre à l'application d'accéder à l'API ss pb

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://sabourouxv:iN1nPKtuLUTCmuSP@cluster0.ckingbg.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;