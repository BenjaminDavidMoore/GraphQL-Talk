const path = require('path');
require('dotenv').config({
	silent: true,
	path: path.join(__dirname, '.env')
});
const express = require('express');
const { ApolloServer } = require('apollo-server');
const { bodyParserGraphQL } = require('body-parser-graphql');
const { directives: schemaDirectives } = require('./graphql/directives');
const { endpoint, playgroundEndpoint } = require('../config').server;
const { resolvers } = require('./graphql/resolvers');
const context = require('./graphql/context');
const ExpressRouter = require('express-promise-router');
const formatError = require('./graphql/format-error');
const log = require('../utils/logger')();
const typeDefs = require('./graphql/schema');
// const routes = require('./_drivers/routes');
const { buildFederatedSchema } = require('@apollo/federation');
const { gql } = require('apollo-server-express');

const routes = [];
const app = express();

const server = new ApolloServer({
	schema: buildFederatedSchema([{
		resolvers,
		typeDefs
	}]),
	context,
	formatError,
	schemaDirectives
});

server.listen(4002);
