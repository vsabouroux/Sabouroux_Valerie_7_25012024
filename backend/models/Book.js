const mongoose = require("mongoose");
//utilisation de la fonction "schema"mad par mongoose et utilisation de "required" pour dire que c'est obligatoire
const bookSchema = mongoose.Schema({
  id: { type: String },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, required: true },
});

// pour pouvoir l'utiliser dans l'app express
module.exports = mongoose.model("Book", bookSchema);
