const data = require('./data');

exports.seed = async knex => {
	await knex('drivers').insert(
		data.reduce((drivers, vehicle) => {
			return drivers.concat(vehicle.drivers);
		}, [])
	);
};
