const { identity } = require("lodash");

const resolvers = {
	Query: {
		driver: (root, query, { driverRepo }) => driverRepo.findOne(query),
		drivers: (root, query, { driverRepo }) => driverRepo.findMany(query)
	},
	Mutation: {
		createDriver: (root, { input }, { driverRepo }) => driverRepo.insertOne(input),
		updateDriver: (root, { input: { id, ...data } }, { driverRepo }) => driverRepo.updateOne({ id }, data),
		deleteDriver: (root, { input: { id } }, { driverRepo }) => driverRepo.destroyOne({ id })
	},
	Driver: {
		async __resolveReference(ref, { driverRepo }) {
			return driverRepo.findOne({ id: ref.id });
		},
		vehicles: async ({ id }, query, { db }) => {
			const driversVehicles = await db('drivers_vehicles').where({ driverId: id });

			return driversVehicles.map(dV => ({ __typename: "Vehicle", id: dV.vehicleId }))
		}
	}
};

module.exports = resolvers;
