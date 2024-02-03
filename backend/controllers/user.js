//installation du package bcrypt pour hacher le password
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const User = require("../models/User");

exports.signup = (req, res, next) =>{
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User ({
            email: req.body.email,
            password : hash
        });
    user.save()
        .then(() => res.status(201).json({message : "Utlisateur créé !"}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

//cette fonction permet de vérifier si un utilisateur existe ds BDD et si le mdp tranmis par le client correspond à cet utilisateur
exports.login = (req, res, next) =>{
User.findOne({email:req.body.email})
.then(user =>{
    if (!user){
        return res.status(401).json({message : "Utilisateur et/ou mot de passe incorrects"});
    }
    bcrypt.compare(req.body.password, user.password)
    .then(valid => {
        if (!valid){
            return res.status(401).json({message : "Utilisateur et/ou mot de passe incorrects"});
        }
        res.status(200).json({
        userId :user._id,
        token : jwt.sign(
            {userId:user._id},
            "RANDOM_TOKEN_SECRET",
            {expiresIn:"24h"}
        )
    });
    })
    .catch(error => res.status(500).json({error}));
})
.catch(error => res.status(500).json({error})); //erreur serveur et non qd pas de champ pas rempli
};
