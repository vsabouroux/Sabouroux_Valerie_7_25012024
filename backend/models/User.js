const mongoose = require("mongoose");
const uniqueValidator = require ("mongoose-unique-validator");

//"unique"pour éviter que 2 users puissent s'inscrire avec la même adresse mail ==> donc impossible de s'inscrire 2 fois avec la même adresse mail et pour 
//éviter tout pb on installe le package npm install --save mongoose-unique-validator
const userSchema = mongoose.Schema({
    email:{type : String, required:true, unique:true},
    password:{type: String, required:true}
});
userSchema.plugin(uniqueValidator);//comme ça on ne pourra pas avoir 2 users avec la même adresse mail

module.exports = mongoose.model("User", userSchema);