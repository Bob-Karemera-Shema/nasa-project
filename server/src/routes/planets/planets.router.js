// Planets Router
const express = require('express');
const { httpGetAllPlanets } = require('./planets.controller');
const planetsRouter = express.Router();

// Planets Routes
planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;