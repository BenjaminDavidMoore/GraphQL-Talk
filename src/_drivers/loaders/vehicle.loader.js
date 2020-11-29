const DataLoader = require('dataloader');
const repositories = require('../../repositories');

const batchVehicles = async vehicleIds => {
	const vehicles = await repositories.vehicleRepo.findMany({ id: vehicleIds });

	const vehicleMap = {};
	vehicles.forEach(vehicle => {
		vehicleMap[vehicle.id] = vehicle;
	});

	return vehicleIds.map(id => vehicleMap[id]);
};

module.exports = () => new DataLoader(batchVehicles);
