exports.seed = async knex => {
	if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') throw new Error("Don't Run Seeds In Prod!");
	const blacklist = [ '_migrations', '_migrations_lock' ];
	const data = await knex.raw("SELECT tablename FROM pg_tables WHERE schemaname='public'");
	const tables = data.rows.map(table => table.tablename).filter(table => blacklist.indexOf(table) < 0);

	return knex.raw(`TRUNCATE ${tables.join(',')} CASCADE`);
};
