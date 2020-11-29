const path = require('path');
require('dotenv').config({
	silent: true,
	path: path.join(__dirname, '.env')
});
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { bodyParserGraphQL } = require('body-parser-graphql');
const { directives: schemaDirectives } = require('./graphql/directives');
const { endpoint, playgroundEndpoint } = require('../config').server;
const { resolvers } = require('./graphql/resolvers');
const context = require('./graphql/context');
const ExpressRouter = require('express-promise-router');
const formatError = require('./graphql/format-error');
const log = require('../utils/logger')();
const typeDefs = require('./graphql/schema');
const routes = require('./routes');
const app = express();

const server = new ApolloServer({
	formatError,
	resolvers,
	typeDefs,
	context,
	schemaDirectives,
	playground: {
		endpoint: playgroundEndpoint,
		settings: {
			'editor.theme': 'dark',
			'editor.cursorShape': 'line'
		}
	}
});

app.use(bodyParserGraphQL());

server.applyMiddleware({ app, endpoint });

const router = ExpressRouter();

// Register the routes
routes.forEach(route => {
	switch (route.method) {
	case 'GET':
		router.get(route.path, route.controller);
		break;
	case 'POST':
		router.post(route.path, route.controller);
		break;
	case 'PUT':
		router.put(route.path, route.controller);
		break;
	case 'PATCH':
		router.patch(route.path, route.controller);
		break;
	case 'DELETE':
		router.delete(route.path, route.controller);
		break;
	default:
		throw new Error(`Failed to load route. Invalid method: ${route.method} for path ${route.path}`);
	}
});

// Load the router
app.use('/', router);

app.listen({ port: 4000 }, () => {
	log.info('The server has started!');
});
