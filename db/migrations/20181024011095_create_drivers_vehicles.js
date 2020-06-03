exports.up = knex => knex.schema.createTable('drivers_vehicles', table => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('driver_id').references('id').inTable('drivers').notNullable().onDelete('cascade');
	table.uuid('vehicle_id').references('id').inTable('vehicles').notNullable().onDelete('cascade');

	// Can't have multiple of the same drivers with the same vehicle
	table.unique([ 'driver_id', 'vehicle_id' ]);

	table.timestamp('created_at').notNullable().defaultTo(knex.raw('NOW()'));
	table.timestamp('updated_at').nullable();
	table.timestamp('deleted_at').nullable();
});

exports.down = knex => knex.schema.dropTable('drivers_vehicles');
