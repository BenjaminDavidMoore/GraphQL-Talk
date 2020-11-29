const resolvers = {
	Query: {
		vehicle: (root, query, { vehicleRepo }) => vehicleRepo.findOne(query),
		vehicles: (root, query, { vehicleRepo }) => vehicleRepo.findMany(query)
	},
	Mutation: {
		createVehicle: (root, { input: { name, vehicles } }, { vehicleRepo }) => vehicleRepo.createVehicleWithDrivers(name, vehicles),
		updateVehicle: (root, { input: { name, vehicles } }, { vehicleRepo }) => vehicleRepo.createVehicleWithDrivers(name, vehicles),
		deleteVehicle: (root, { input: { name, vehicles } }, { vehicleRepo }) => vehicleRepo.createVehicleWithDrivers(name, vehicles)
	},
	Vehicle: {
		async __resolveReference(ref, { vehicleRepo }) {
			return vehicleRepo.findOne({ id: ref.id });
		},
		drivers: async ({ id }, query, { db }) => {
			const driversVehicles = await db('drivers_vehicles').where({ vehicleId: id });
			
			return driversVehicles.map(dV => ({ __typename: "Driver", id: dV.driverId }))
		}
	}
};

module.exports = resolvers;
