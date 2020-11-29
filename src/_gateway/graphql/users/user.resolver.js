const resolvers = {
	Query: {
		user: (root, query, { userRepo }) => userRepo.findOne(query),
		users: (root, query, { userRepo }) => userRepo.findMany(query)
	}
};

module.exports = resolvers;
