const Joi = require('joi');

const log = require('../utils/logger')();

const BaseRepo = require('./base.repo');

const schema = Joi.object({
	id: Joi.string().optional(),
	name: Joi.string().optional(),
	address: Joi.string().optional(),
	zip: Joi.number().optional()
});

module.exports = class DriverRepo extends BaseRepo {
	constructor() {
		super('drivers', schema);
	}

	findByVehicleId(vehicleId) {
		log.info('Fetching Drivers By VehicleId:', vehicleId);

		return this.db('drivers')
			.join('drivers_vehicles', 'drivers_vehicles.driver_id', 'drivers.id')
			.where('drivers_vehicles.vehicle_id', '=', vehicleId)
			.select('drivers.*');
	}
};
