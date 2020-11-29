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

	async createVehicleWithDrivers(name, driverIds) {
		const vehicle = await this.db('vehicles').insert({ name }).returning('*')

		if(driverIds && driverIds.length) {
			await this.db('drivers_vehicles').insert[driverIds.map(driverId => ({ driverId, vehicleId: vehicle.id }))]
		}

		return vehicle[0];
	}

};
