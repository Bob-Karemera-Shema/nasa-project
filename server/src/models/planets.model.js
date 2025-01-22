const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const habitablePLanets = [];

const isHabitablePlanet = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
};

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', (planet) => {
            if (isHabitablePlanet(planet)) habitablePLanets.push(planet);
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', () => {
            console.log(`${habitablePLanets.length} habitable planets found!`);
            resolve();
        });
    });
}

function getAllPlanets() {
    return habitablePLanets
}


module.exports = {
    loadPlanetsData,
    getAllPlanets
};