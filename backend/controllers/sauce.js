const Sauce = require('../models/sauce');
const User = require("../models/user");
const { ObjectId } = require('mongodb')
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => res.status(200).json(sauces))
  .catch((error) => res.status(400).json({error: error}));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then((sauce) => res.status(200).json(sauce))
  .catch((error) => res.status(404).json({error: error}));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [""], 
      usersDisliked: [""], 
  });

  sauce.save()
  .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
  .catch(error => res.status(400).json( { error }))
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.sauceLikes = (req, res, next) => {
  let sauceId = req.params.id
  let userId = req.body.userId
  let like = req.body.like

  switch(like) {
    // Si like = 1, l'utilisateur aime (= likes)
    case 1 : 
    Sauce.updateOne(
      { _id: sauceId }, 
      {
        $push : { usersLiked: userId },
        $inc : { likes: +1 }
      }
    )  
      .then(() => res.status(200).json({message: "J'aime"}))
      .catch((error) => res.status(400).json({ error }));

    break;

    // Si like = 0, l'utilisateur annule son like ou son dislike
    case 0 :
      Sauce.findOne(
        { _id: sauceId }
      )
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersLiked: userId },
              $inc: { likes: -1 }
            }
          )
            .then(() => res.status(200).json({message: "Unliked"}))
            .catch((error) => res.status(400).json({ error }))
        }
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 }
            }
          )
            .then(() => res.status(200).json({message: "Undisliked"}))
            .catch((error) => res.status(400).json({ error }))
        }
      })
      .catch((error) => res.status(404).json({ error }))
  
    break;

    // Si like = -1, l'utilisateur n'aime pas (= dislikes)
    case -1 :
      Sauce.updateOne(
        { _id: sauceId }, 
        {
          $push : { usersDisliked: userId },
          $inc : { dislikes: +1 }
        }
      )  
        .then(() => res.status(200).json({message: "Je n'aime pas"}))
        .catch((error) => res.status(400).json({ error }));
  
      break;
  }
};