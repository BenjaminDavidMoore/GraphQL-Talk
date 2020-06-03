const config = require('./config').db;

module.exports = {
	...config,
	migrations: {
		tableName: '_migrations',
		directory: '../db/migrations'
	},
	seeds: {
		directory: '../db/seeds'
	}
};
