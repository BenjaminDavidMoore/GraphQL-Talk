const config = require('./config').db;
console.log('CONFIG', config)
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
