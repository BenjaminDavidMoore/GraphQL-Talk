const resolvers = {
	Query: {
		driver: (root, query, {
			driverRepo
		}) => driverRepo.findOne(query),
		drivers: (root, query, {
			driverRepo
		}) => driverRepo.findMany(query)
	},
	Mutation: {
		createDriver: (root, {
			input
		}, {
			driverRepo
		}) => driverRepo.insertOne(input),
		updateDriver: (root, {
			input: {
				id,
				...data
			}
		}, {
			driverRepo
		}) => driverRepo.updateOne({
			id
		}, data),
		deleteDriver: (root, {
			input: {
				id
			}
		}, {
			driverRepo
		}) => driverRepo.deleteOne({
			id
		})
	}
};

module.exports = resolvers;
