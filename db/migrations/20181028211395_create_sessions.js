exports.up = knex => knex.schema.createTable('sessions', table => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('user_id').references('id').inTable('users').notNullable().onDelete('cascade');

	table.timestamp('created_at').notNullable().defaultTo(knex.raw('NOW()'));
	table.timestamp('updated_at').nullable();
	table.timestamp('deleted_at').nullable();
});

exports.down = knex => knex.schema.dropTable('sessions');
