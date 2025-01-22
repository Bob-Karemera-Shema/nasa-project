const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    'flightNumber': 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    destination: 'Kepler-442 b',
    customers: ['NASA', 'ZTM', 'LC'],
    upcoming: true,
    success: true
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(newLaunch) {
    latestFlightNumber += 1;
    launches.set(
        latestFlightNumber, 
        Object.assign(newLaunch, {
            flightNumber: latestFlightNumber,
            customers: ['NASA', 'LC', 'ZTM'],
            upcoming: true,
            success: true
        })
    );
}

module.exports = {
    getAllLaunches,
    addNewLaunch
};