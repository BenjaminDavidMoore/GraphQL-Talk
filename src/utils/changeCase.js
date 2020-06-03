const _ = require('lodash');

const transform = (data, func) => {
	if (!data) {
		return data;
	} else if (Array.isArray(data)) {
		return data.map(elem => transform(elem, func));
	} else if (typeof data === 'object') {
		return _.mapKeys(data, (value, key) => transform(key, func));
	}
	return func(data);
};

const camelCase = data => {
	return transform(data, _.camelCase);
};

const snakeCase = data => {
	return transform(data, _.snakeCase);
};

const specialChars = [ '*' ];
const convertCase = (val, func) => {
	if (specialChars.includes(val)) return val;

	return func(val);
};

module.exports = {
	camelCase,
	snakeCase,
	convertCase
};
