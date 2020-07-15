const { AuthenticationError, SchemaDirectiveVisitor } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');
const gql = require('graphql-tag');

const log = require('../utils/logger')();

class RoleDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(object) {

		const { resolve = defaultFieldResolver } = object;
		object.resolve = async (result, args, context, info) => {
			// Grab the actor id and permission repo from the context
			const { authorization, sessionRepo } = context;

			// Throw an error if there was no actor id provided in the headers
			if (!authorization) throw new AuthenticationError('You must be authenticated to make this request');

			// Grab the actor's set of permissions and filter out the keys
			try {
				// Since we already fetched it, might as well put it in the context for future use
				context.actor = await sessionRepo.findUserWithSession(authorization);
			} catch (err) {
				log.error(err);
				// Assuming that the error occured because context had no actorId (probably an unauthorized user)
				throw new AuthenticationError('You do not have the authorization to perform this action');
			}

			// The arguments to the directive are the required role for this query / mutation
			const requiredRoles = this.args.roles;

			console.log('-- Required Roles --', requiredRoles);
			console.log('-- Actor: --', context.actor);

			// Check for a difference between the required role and the actor's role
			const hasPermission = !!requiredRoles.find(role => role.toLowerCase() === context.actor.role.toLowerCase());

			// If there is a difference, throw an error
			if (!hasPermission) throw new AuthenticationError('You do not have the authorization to perform this action');

			// Pass along the request to the resolver to be executed normally
			return await resolve.apply(this, [ result, args, context, info ]);
		};
	}
}

const schema = gql`
	directive @role(roles: [String]) on FIELD_DEFINITION
`;

module.exports = {
	directives: {
		role: RoleDirective
	},
	schema
};
