const resolvers = {
	Mutation: {
		login: (root, { input: { name } }, { sessionRepo }) => sessionRepo.login(name)
	}
};

module.exports = resolvers;
