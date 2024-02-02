const express = require("express");
const router = express.Router();// méthode Router d'express
//"/api/books" = route de base url de base donc on va le remplacer par /

router.post("/",(req, res, next)=>{
    console.log(req.body);
    res.status(201).json({message : "livre créé !"});
});
router.get("/",(req, res, next)=>{
    const books = [
        {
            userId :"Coco",
            title : "Nom du livre",
            author: "Auteur du livre",
            imageUrl: "",
            year:"Année de publication du livre",
            genre : "Genre du livre",
            ratings : [
                {
                    userId: "je ne sais pas est-ce que c'est Coco ? ou celui de MongoDB ?",
                    grade:"note donnée au livre",
                }
            ],
            averageRating: "note moyenne du livre"
        }
    ];
    res.status(200).json({books})
});

module.exports = router;