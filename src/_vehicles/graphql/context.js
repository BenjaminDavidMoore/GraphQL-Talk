const db = require('../../utils/db');
const repos = require('../../repositories');
const loaders = require('../loaders');

module.exports = ({ req, res }) => {
	// On each new request, generate a new data loader so caching is not kept across requests
	const dataLoaders = {};
	for (const loader in loaders) {
		dataLoaders[loader] = loaders[loader]();
	}

	console.log('Vehicle context',req.header('Authorization') );

	return {
		req,
		res,
		authorization: req.header('authorization'),
		db,
		...repos,
		...dataLoaders
	};
};
