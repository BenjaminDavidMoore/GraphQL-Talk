const resolvers = {
	Query: {
		vehicle: (root, query, {
			vehicleRepo
		}) => vehicleRepo.findOne(query),
		vehicles: (root, query, {
			vehicleRepo
		}) => vehicleRepo.findMany(query)
	},
	Mutation: {
		createVehicle: (root, {
			input: {
				name,
				vehicles
			}
		}, {
			vehicleRepo
		}) => vehicleRepo.createVehicleWithPlayers(name, vehicles),
		updateVehicle: (root, {
			input: {
				name,
				vehicles
			}
		}, {
			vehicleRepo
		}) => vehicleRepo.createVehicleWithPlayers(name, vehicles),
		deleteVehicle: (root, {
			input: {
				name,
				vehicles
			}
		}, {
			vehicleRepo
		}) => vehicleRepo.createVehicleWithPlayers(name, vehicles)
	},
	Vehicle: {
		drivers: ({
			id: vehicleId
		}, query, {
			driverLoader,
			driverRepo
		}) => {
			// return driverRepo.findByVehicleId(vehicleId);
			// return driverLoader.load(vehicleId);
			throw new Error('Oh shit');
		}
	}
};

module.exports = resolvers;
