const Random = require(`${process.cwd()}/utils/random`);

module.exports = [ {
	vehicle: Random.vehicle({ name: 'The Milano' }),
	drivers: [
		Random.driver({ name: 'Peter "Starloard" Quill' }),
		Random.driver({ name: 'Rocket' }),
		Random.driver({ name: 'Thor' }),
		Random.driver({ name: 'Gamora' })
	]
}, {
	vehicle: Random.vehicle({ name: 'The Tardis' }),
	drivers: [
		Random.driver({ name: 'The Doctor' })
	]
}, {
	vehicle: Random.vehicle({ name: 'Enterprise' }),
	drivers: [
		Random.driver({ name: 'Captain Jean Luc Picard' }),
		Random.driver({ name: 'Data' }),
		Random.driver({ name: 'Geordie' }),
		Random.driver({ name: 'Captain James Tiberius Kirk' })
	]
}, {
	vehicle: Random.vehicle({ name: 'The DeLorean DMC-12' }),
	drivers: [
		Random.driver({ name: 'Doc Brown' }),
		Random.driver({ name: 'Marty McFly' })
	]
}, {
	vehicle: Random.vehicle({ name: 'The Nautilus' }),
	drivers: [
		Random.driver({ name: 'Captain Nemo' })
	]
}, {
	vehicle: Random.vehicle({ name: 'Epona' }),
	drivers: [
		Random.driver({ name: 'Link' })
	]
} ];
