const DateFNS = require('date-fns');

// Yes, Winston, I put it in the logs!
const winston = require('winston');

winston.addColors({
	silly: 'magenta',
	debug: 'blue',
	verbose: 'cyan',
	info: 'green',
	warn: 'yellow',
	error: 'red'
});

module.exports = (level = 'silly') => {
	const opts = {
		level,
		transports: [
			new (winston.transports.Console)({
				prettyPrint: true,
				timestamp: () => {
					return DateFNS.format(new Date(), 'MM/DD/YY HH:mm:ss:SSS');
				},
				formatter: options => {
					return `${options.timestamp()} [${winston.config.colorize(options.level, options.level.toUpperCase())}] ${(options.message ? options.message : '')} ${(options.meta ? `${JSON.stringify(options.meta)}` : '')}`;
				}
			})
		]
	};

	// When running tests, reduce the noise and don't log unless debug is turned on
	if (process.env.NODE_ENV === 'test' && process.env.DEBUG !== 'true') {
		return {
			warn: () => {},
			info: () => {},
			error: () => {}
		};
	}
	return new (winston.Logger)(opts);
};
