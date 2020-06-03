const Joi = require('joi');

const BaseRepo = require('./base.repo');

const schema = Joi.object({
	name: Joi.string().optional()
});

module.exports = class VehicleRepo extends BaseRepo {
	constructor() {
		super('vehicles', schema);
	}

	getDrivers(vehicleId) {
		return this.db('drivers_vehicles')
			.join('drivers', 'drivers_vehicles.driver_id', 'drivers.id')
			.where('drivers_vehicles.vehicle_id', '=', vehicleId);
	}
};
