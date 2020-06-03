exports.up = knex => knex.schema.createTable('drivers', table => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('name').unique().notNullable();
	table.string('address');
	table.integer('zip');

	table.timestamp('created_at').notNullable().defaultTo(knex.raw('NOW()'));
	table.timestamp('updated_at').nullable();
	table.timestamp('deleted_at').nullable();
});

exports.down = knex => knex.schema.dropTable('drivers');
