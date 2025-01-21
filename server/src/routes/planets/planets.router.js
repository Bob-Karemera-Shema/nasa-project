// Planets Router
const express = require('express');
const { getAllPlanets } = require('./planets.controller');
const planetsRouter = express.Router();

// Planets Routes
planetsRouter.get('/planets', getAllPlanets);

module.exports = planetsRouter;