const launchesDB = require('./launches.mongo');
const planetsDB = require('./planets.mongo');

const launches = new Map();

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['NASA', 'ZTM', 'LC'],
    upcoming: true,
    success: true
};

saveLaunch(launch);

function existsWithId(id) {
    return launches.has(id);
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB.findOne().sort('-flightNumber');

    if(!latestLaunch) return 100; // if there are no launches yet, return default flight number

    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launchesDB.find({}, { '_id': 0, '__v': 0 });
}

async function saveLaunch(launch) {
    try {
        const planet = await planetsDB.findOne({
            keplerName: launch.target,
        });

        if(!planet) throw new Error('No matching planet found');

        await launchesDB.findOneAndUpdate({
            flightNumber: launch.flightNumber,
        }, launch, {
            upsert: true,
        });
    } catch (err) {
        console.error('Error saving launch:', err);
    }
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['NASA', 'LC', 'ZTM'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

function abortLaunchById(id) {
    const aborted = launches.get(id);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    existsWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
};