const Chance = require('chance');
const Random = new Chance();

Random.mixin({
	driver: (options = {}) => {
		const defaults = {
			id: Random.guid(),
			name: Random.name(),
			address: Random.address(),
			zip: Random.zip()
		};

		return { ...defaults, ...options };
	},

	vehicle: (options = {}) => {
		const defaults = {
			id: Random.guid(),
			name: Random.name()
		};

		return { ...defaults, ...options };
	},

	user: (options = {}) => {
		const defaults = {
			id: Random.guid(),
			name: Random.name(),
			role: Random.pickone([ 'admin', 'notAdmin' ])
		};

		return { ...defaults, ...options };
	}
});

module.exports = Random;
