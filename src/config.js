const { camelCase, convertCase, snakeCase } = require('./utils/changeCase');

const getPlaygroundEndpoint = () => {
	if (process.env.NODE_ENV === 'dev') {
		return '/dev/graphql';
	} else if (process.env.NODE_ENV === 'prod') {
		return '/prod/graphql';
	}
	return '/graphql';
};

module.exports = {
	server: {
		port: process.env.APP_PORT || 4000,
		endpoint: '/graphql',
		playgroundEndpoint: getPlaygroundEndpoint(),
		remoteServices: {
			vehicles: { url: 'http://localhost:4001/graphql' },
			drivers: { url: 'http://localhost:4002/graphql' }
		}
	},
	db: {
		charset: 'utf8',
		client: 'pg',
		debug: process.env.DEBUG === 'true',
		pool: {
			min: process.env.POSTGRES_POOL_MIN || 2,
			max: process.env.POSTGRES_POOL_MAX || 10
		},
		connection: {
			host: process.env.POSTGRES_HOST || 'localhost',
			port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
			user: process.env.POSTGRES_USER || 'postgres',
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB || 'postgres'
		},
		postProcessResponse: result => convertCase(result, camelCase),
		wrapIdentifier: (value, origImpl) => origImpl(convertCase(value, snakeCase))
	}
};
