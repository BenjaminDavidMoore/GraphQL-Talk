const UserRepo = require('./user.repo');
const DriverRepo = require('./driver.repo');
const VehicleRepo = require('./vehicle.repo');
const SessionRepo = require('./session.repo');

module.exports = {
	UserRepo,
	DriverRepo,
	VehicleRepo,
	SessionRepo,

	userRepo: new UserRepo(),
	driverRepo: new DriverRepo(),
	vehicleRepo: new VehicleRepo(),
	sessionRepo: new SessionRepo()
};
