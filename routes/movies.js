const express = require('express');
const joi = require('@hapi/joi');
const MoviesServices = require('../services/movies');

const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movies');

const validationHandler = require('../utils/middleware/validationHandlers');

function moviesApi(app) {
  const router = express.Router();

  app.use('/api/movies', router);

  const moviesService = new MoviesServices();

  router.get('/', async function (req, res, next) {
    const { tags } = req.query;
    try {
      const movies = await moviesService.getMovies({ tags });
      res.status(200).json({
        data: movies,
        message: 'movies listed',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

  // Obtener movie por id
  router.get(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async function (req, res, next) {
      const { movieId } = req.params;
      try {
        const movies = await moviesService.getMovie({ movieId });
        res.status(200).json({
          data: movies,
          message: 'movies retrieved',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // create
  router.post(
    '/',
    validationHandler(createMovieSchema),
    async function (req, res, next) {
      const { body: movie } = req;
      try {
        const createdMovieId = await moviesService.createMovie({ movie });
        res.status(201).json({
          data: createdMovieId,
          message: 'movie created',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // PUT - actualizar
  router.put(
    '/:movieId',
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler(updateMovieSchema),
    async function (req, res, next) {
      const { movieId } = req.params;
      const { body: movie } = req;
      try {
        const updatedMovieId = await moviesService.updateMovie({
          movieId,
          movie,
        });
        res.status(200).json({
          data: updatedMovieId,
          message: 'movie updated',
        });
      } catch (error) {
        next(error);
      }
    }
  );

  // delete
  router.delete('/:movieId', async function (req, res, next) {
    const { movieId } = req.params;
    try {
      const deleteMovieId = await moviesService.deleteMovie({ movieId });
      res.status(200).json({
        data: deleteMovieId,
        message: 'movies deleted',
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = moviesApi;
