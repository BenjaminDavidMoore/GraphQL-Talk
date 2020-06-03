const data = require('./data');

exports.seed = async knex => {
	await knex('drivers_vehicles').insert(
		data.reduce((driversVehicles, vehicle) => {
			const dv = [];
			vehicle.drivers.forEach(driver => {
				dv.push({
					vehicleId: vehicle.vehicle.id,
					driverId: driver.id
				});
			});

			return driversVehicles.concat(dv);
		}, [])
	);
};
