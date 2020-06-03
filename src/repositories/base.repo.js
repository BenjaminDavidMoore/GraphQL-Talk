const Joi = require('joi');

const db = require('../utils/db');
const { camelCase, snakeCase } = require('../utils/changeCase');

module.exports = class Repository {
	constructor(tableName, schema) {
		this.db = db;
		this.tableName = tableName;
		this.schema = schema;
	}

	validate(data, schema) {
		return Joi.validate(data, schema);
	}

	async findOne(selectors = {}) {
		// Supporting soft deletes
		const defaults = {
			deleted_at: null
		};

		const criteria = {
			...defaults,
			...snakeCase(selectors)
		};

		const record = await this.db(this.tableName)
			.where(criteria)
			.first();

		return camelCase(record);
	}

	findMany(selectors = {}) {
		const defaults = {
			deleted_at: null
		};

		const criteria = {
			...defaults,
			...snakeCase(selectors)
		};

		let query = this.db(this.tableName);

		Object.keys(criteria).forEach(k => {
			if (Array.isArray(criteria[k])) {
				query = query.whereIn(k, criteria[k]);
			} else {
				query = query.where(k, criteria[k]);
			}
		});

		return query.map(record => camelCase(record));
	}

	async insertBulk(records = []) {
		if (records.length === 0) {
			return null;
		}

		try {
			await Promise.all(records.map(data => this.validate(data, this.schema)));
		} catch (err) {
			throw new Error(err);
		}

		const data = snakeCase(records);

		const insertedRecords = await this.db(this.tableName)
			.insert(data)
			.returning('*');

		if (!insertedRecords) {
			return null;
		}

		return insertedRecords.map(camelCase);
	}

	async insertOne(values = {}) {
		const records = await this.insertBulk([ values ]);

		if (!records) {
			return null;
		}

		return records[0];
	}

	async updateOne(selectors = {}, changes = {}) {
		const criteria = snakeCase(selectors);
		const updates = snakeCase(changes);

		const records = await this.db(this.tableName)
			.where(criteria)
			.first()
			.update(updates)
			.returning('*');

		if (!records) {
			return null;
		}

		return camelCase(records[0]);
	}

	// Soft delete only one record
	async deleteOne(selectors = {}) {
		const criteria = snakeCase(selectors);

		const result = await this.raw()
			.where(criteria)
			.first()
			.update({
				deleted_at: new Date()
			});

		return result > 0;
	}

	// Soft delete many records
	async deleteMany(selectors = {}) {
		const criteria = snakeCase(selectors);

		const result = await this.raw()
			.where(criteria)
			.update({
				deleted_at: new Date()
			});

		return result > 0;
	}

	// Hard delete from the database... ain't no going back here
	async destroyOne(selectors = {}) {
		const criteria = snakeCase(selectors);

		const result = await this.raw()
			.where(criteria)
			.first()
			.del();

		return result > 0;
	}

	raw() {
		return this.db(this.tableName);
	}
};
