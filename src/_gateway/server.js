const path = require('path');
require('dotenv').config({
	silent: true,
	path: path.join(__dirname, '.env')
});

const { ApolloServer } = require('apollo-server');
const { ApolloGateway, LocalGraphQLDataSource, RemoteGraphQLDataSource } = require('@apollo/gateway');
const { buildFederatedSchema } = require('@apollo/federation');

const { directives: schemaDirectives } = require('./graphql/directives');
const { resolvers } = require('./graphql/resolvers');
const context = require('./graphql/context');
const formatError = require('./graphql/format-error');
const typeDefs = require('./graphql/schema');
const { remoteServices } = require('../config').server;

const services = {
	local: {
		typeDefs,
		resolvers
	},
	...remoteServices
}

// By providing a protocol we trick ApolloGateway into thinking that this is a valid URL;
// otherwise it assumes it's a relative URL, and complains.
const DUMMY_SERVICE_URL = 'https://';

const gateway = new ApolloGateway({
  // We can't use localServiceList and serviceList at the same time,
  // so we pretend the local services are remote, but point the ApolloGateway
  // at LocalGraphQLDataSources instead...
  serviceList: Object.keys(services).map(name => ({
    name,
    url: services[name].url || DUMMY_SERVICE_URL
  })),
  buildService({ name, url }) {
    if (url === DUMMY_SERVICE_URL) {
      return new LocalGraphQLDataSource(
        buildFederatedSchema(
			{
				resolvers: services[name].resolvers,
				typeDefs: services[name].typeDefs
			}
        )
      );
    } else {
      return new RemoteGraphQLDataSource({
		url,
		willSendRequest({ request, context }) {
			// Pass the user's id from the context to underlying services
			// as a header called `user-id`
			request.http.headers.set('authorization', context.authorization);
		}
      });
    }
  }
});

const server = new ApolloServer({
	gateway,
	subscriptions: false,
	context,
	formatError,
	schemaDirectives
});
server.listen();
