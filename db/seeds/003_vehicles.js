const data = require('./data');

exports.seed = async knex => {
	await knex('vehicles').insert(data.map(vehicle => vehicle.vehicle));
};
