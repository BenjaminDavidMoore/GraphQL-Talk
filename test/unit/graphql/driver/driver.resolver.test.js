const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, beforeEach } = lab;

const { resetDB, Random, insert, deepEqual, generateContext } = require('../../../helpers');
const { expect } = require('code');

const resolvers = require(`${process.cwd()}/src/graphql/team/team.resolver`);

describe('Create A Team', () => {

	beforeEach(() => {
		return resetDB();
	});

	it('should create a team with players', async () => {
		// Create new data
		const newPlayer1 = Random.player();
		const newPlayer2 = Random.player();
		const team = Random.team();
		delete team.id;

		// Slap er in the db
		await insert('players', [ newPlayer1, newPlayer2 ]);

		// Pull out the resolver
		const { Mutation: { createTeam } } = resolvers;

		// slap the players on the team
		const teamWithPlayers = { ...team, players: [ newPlayer1.id, newPlayer2.id ] };

		const context = await generateContext();

		// Run the resovler
		const result = await createTeam({}, { input: teamWithPlayers }, context);

		// Test the format of the response
		expect(result).to.be.an.object();

		// Test the info you gave it
		expect(deepEqual(team, result)).to.equal(true);

		expect(result.players.length).to.equal(2);
	});
});
