const Joi = require('joi');

const BaseRepo = require('./base.repo');

const schema = Joi.object({
	userId: Joi.string().guid().required()
});

module.exports = class SessionRepo extends BaseRepo {
	constructor() {
		super('sessions', schema);
	}

	async login(userName) {
		const user = await this.db('users').where({ name: userName }).first();

		if (!user) return null;

		return super.insertOne({ userId: user.id });
	}

	findUserWithSession(sessionId) {
		return this.db('sessions')
			.join('users', 'sessions.user_id', 'users.id')
			.select('users.*')
			.where('sessions.id', '=', sessionId)
			.first();
	}

};
