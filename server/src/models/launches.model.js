const axios = require('axios');

const launchesDB = require('./launches.mongo');
const planetsDB = require('./planets.mongo');

const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
    console.log('Downloading launch data...');
    const response = await axios.post(`${SPACE_X_API_URL}`, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    if(response.ok) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        };

        console.log(`${launch.flightNumber} ${launch.mission}`);

        // populate launches collection
        await saveLaunch(launch)
    }
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if (firstLaunch) {
        console.log('Launch data already loaded1');
    } else {
        await populateLaunches();
    }
}

async function findLaunch(filter) {
    return await launchesDB.findOne(filter);
}

async function existsWithId(id) {
    return await findLaunch({ flightNumber: id });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB.findOne().sort('-flightNumber');

    if (!latestLaunch) return 100; // if there are no launches yet, return default flight number

    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
    return await launchesDB.find({}, { '_id': 0, '__v': 0 })
        .sort({ flightNumber: 1})
        .skip(skip)
        .limit(limit);
}

async function saveLaunch(launch) {
    await launchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch) {    
    const planet = await planetsDB.findOne({
        keplerName: launch.target,
    });

    if (!planet) throw new Error('No matching planet found');

    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['NASA', 'LC', 'ZTM'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

async function abortLaunchById(id) {
    const aborted = await launchesDB.updateOne({
        flightNumber: id,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount === 1;
}

module.exports = {
    existsWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    loadLaunchData,
};