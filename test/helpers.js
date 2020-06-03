const Random = require(`${process.cwd()}/src/utils/random`);
const db = require(`${process.cwd()}/src/utils/db`);
const context = require(`${process.cwd()}/src/graphql/context`);
const repos = require(`${process.cwd()}/src/repositories`);

const resetDB = async () => {
	const blacklist = [ '_migrations', '_migrations_lock' ];
	const data = await db.raw("SELECT tablename FROM pg_tables WHERE schemaname='public'");
	const tables = data.rows.map(table => table.tablename).filter(table => blacklist.indexOf(table) < 0);

	return db.raw(`TRUNCATE ${tables.join(',')} CASCADE`);
};

const insert = (table, data) => {
	return db(table).insert(data);
};

const deepEqual = (a, b) => {
	const expectedKeys = Object.keys(a);

	return expectedKeys.some(key => {
		return b[key] === a[key];
	});
};

// Creates a session for a player and then generates the context for them
const generateContext = async playerId => {
	const { sessionRepo } = repos;
	let session;

	if (playerId) {
		session = await sessionRepo.generateSession(playerId);
	}

	return context({ req: { header: () => session } });
};

module.exports = {
	Random,
	resetDB,
	insert,
	deepEqual,
	generateContext
};
