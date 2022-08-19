// importation de mongoose
const mongoose = require('mongoose');

// models: données utilisateur pour le page du frontend
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },

  // système de like & dislike
  likes: { type: Number, defaut: 0 },
  dislikes: { type: Number, defaut: 0 },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
  
});

// exportation du module
module.exports = mongoose.model('Sauce', sauceSchema);