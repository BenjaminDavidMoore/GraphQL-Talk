const DataLoader = require('dataloader');
const db = require('../utils/db');
const log = require('../utils/logger')();

const batchDrivers = async vehicleIds => {
	log.info('Fetching drivers for vehicles with ids:', vehicleIds);

	const drivers = await db('drivers')
		.join('drivers_vehicles', 'drivers_vehicles.driver_id', 'drivers.id')
		.whereIn('drivers_vehicles.vehicle_id', vehicleIds);

	const vehicleMap = {};
	drivers.forEach(driver => {
		if (vehicleMap[driver.vehicleId]) vehicleMap[driver.vehicleId].push(driver);
		else vehicleMap[driver.vehicleId] = [ driver ];
	});

	// vehicleIds.sort();

	// The order of the data that is returned MUST be in the same order as the supplied IDs or the
	// Data will be returned to the wrong resolver
	return vehicleIds.map(id => vehicleMap[id]);
};

module.exports = () => new DataLoader(batchDrivers);
