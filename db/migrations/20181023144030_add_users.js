exports.up = knex => knex.schema.createTable('users', table => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('name').notNullable();
	table.string('role').notNullable();

	table.timestamp('created_at').notNullable().defaultTo(knex.raw('NOW()'));
	table.timestamp('updated_at').nullable();
	table.timestamp('deleted_at').nullable();
});

exports.down = knex => knex.schema.dropTable('users');
