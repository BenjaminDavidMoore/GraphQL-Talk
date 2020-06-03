const path = require('path');
const { fileLoader, mergeResolvers } = require('merge-graphql-schemas');
const { isInstance } = require('apollo-errors');
const { createResolver } = require('apollo-resolvers');

const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './**/*.resolver.js')));
const log = require('../utils/logger')();
const { UnauthenticatedError, UnknownError } = require('./throwable-errors');
const repositories = require('../repositories');

const baseResolver = createResolver(null, (root, args, context, err) => {
	if (isInstance(err)) {
		return err;
	}

	log.error(err);
	return new UnknownError();
});

const authenticatedResolver = baseResolver.createResolver(
	async (root, args, context, info) => {
		const { authorization } = context;

		// Or if unauthorized, just throw an unauthorized error
		if (!authorization) throw new UnauthenticatedError();

		// Check for a session and put the valid user's info into the context
		// const { userId } = await authRepo.validateSession(authorization);
		const { id: userId } = await repositories.sessionRepo.findOne({ id: authorization });

		if (!userId) throw new UnauthenticatedError();

		// Add the user id to the context
		context.actorId = userId;
	}
);

const unauthenticatedResolvers = {
	Query: [ 'user', 'users', 'vehicle', 'vehicles', 'driver', 'drivers' ],
	Mutation: [ 'login' ],
	Vehicle: [ 'drivers' ]
};

// Loop through all resolvers and wrap them with the authenticated resolver
// unless it's in the list of unathenticated resolvers
for (const key in resolvers) {
	if (key) {
		for (const resolver in resolvers[key]) {
			if (resolver) {
				if (unauthenticatedResolvers[key].includes(resolver)) continue;
				resolvers[key][resolver] = authenticatedResolver.createResolver(resolvers[key][resolver]);
			}
		}
	}
}

module.exports = {
	resolvers,
	baseResolver,
	authenticatedResolver
};
