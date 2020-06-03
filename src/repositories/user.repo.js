const Joi = require('joi');

const BaseRepo = require('./base.repo');

const schema = Joi.object({
	name: Joi.string().optional()
});

module.exports = class UserRepo extends BaseRepo {
	constructor() {
		super('users', schema);
	}
};
