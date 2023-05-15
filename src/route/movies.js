const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Movie } = require('../model/Movie');

const movieSchema = Joi.object({
  title: Joi.string().required(),
  director: Joi.string().required(),
  releaseYear: Joi.number().required(),
});

router.post('/', async (req, res) => {
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
        console.error(error);
        res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;