const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Movie  = require('../model/Movie');
const logger = require('../middlewares/logger');
const validateMiddleware = require('../middlewares/validate');

const movieSchema = Joi.object({
  title: Joi.string().required(),
  director: Joi.string().required(),
  releaseYear: Joi.number().required(),
});

router.post('/', validateMiddleware(movieSchema), async (req, res) => {
    const { error } = movieSchema.validate(req.body);

    if (error) {
        return res.status(400).send({ error: error.details[0].message });
  }

    const { title, director, releaseYear } = req.body;

    try {
        const newMovie = new Movie({ title, director, releaseYear });
        await newMovie.save();

        res.send(newMovie);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).send({ error: 'Title already exists' });
      }
      logger.error(error);
      res.status(500).send({ error: 'Server error' });
  }
});

// Get all movies
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5; // You can set your preferred limit
  const skip = (page - 1) * limit;
  const searchQuery = req.query.search;

  // Create a query object based on the search query
  const query = searchQuery
    ? {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive partial match on title
          { director: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive partial match on director
        ],
      }
    : {};

  try {
    const movies = await Movie.find(query).skip(skip).limit(limit);
    const totalMovies = await Movie.countDocuments(query);

    res.send({
      movies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / limit),
    });

  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});

// Update a movie by ID
router.put('/:id', validateMiddleware(movieSchema), async (req, res) => {
  const movieId = req.params.id;
  const { title, director, releaseYear } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      { title, director, releaseYear },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    res.send(updatedMovie);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});

// Delete a movie by ID
router.delete('/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if (!deletedMovie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    res.send({ message: 'Movie deleted successfully' });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});

// Get movie details by ID
router.get('/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    res.send(movie);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;