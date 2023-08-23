const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    set: (value) => value.toLowerCase(),
    index: true,
    unique: true,
  },
  director: {
    type: String,
    required: true,
    index: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;