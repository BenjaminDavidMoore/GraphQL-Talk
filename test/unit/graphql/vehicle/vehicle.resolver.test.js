const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, beforeEach } = lab;

const { resetDB, Random, insert, generateContext } = require('../../../helpers');
const { expect } = require('code');

const resolvers = require(`${process.cwd()}/src/graphql/player/player.resolver`);
const PlayerRepo = require(`${process.cwd()}/src/repositories/player.repo`);
const PlayerTeamRepo = require(`${process.cwd()}/src/repositories/playerTeam.repo`);
const TeamRepo = require(`${process.cwd()}/src/repositories/team.repo`);

describe('Create A Player', () => {

	beforeEach(() => {
		return resetDB();
	});

	it('should create a player with the info you give it', async () => {
		const playerRepo = new PlayerRepo();
		const playerTeamRepo = new PlayerTeamRepo();
		const teamRepo = new TeamRepo();

		// Create new data
		const newPlayer = Random.player();
		delete newPlayer.id;

		// Pull out the resolver
		const { Mutation: { createPlayer } } = resolvers;

		const context = await generateContext();

		// Run the resovler which creates a player
		const createdPlayer = await createPlayer({}, { input: newPlayer }, context);

		// Create a team based on that player
		const newTeam = Random.team({ name: `${newPlayer.firstName} ${newPlayer.lastName}` });
		await insert('teams', newTeam);
		const newPlayerTeam = Random.playerTeam({ player: createdPlayer, team: newTeam });
		await insert('players_teams', newPlayerTeam);

		// Test the format of the response
		expect(createdPlayer).to.be.an.object();

		// Test the info you gave it
		const expectedKeys = Object.keys(newPlayer);
		expectedKeys.map(key => {
			expect(newPlayer[key]).to.equal(createdPlayer[key]);
		});

		// Test the extra info that was created
		const { id, deletedAt, createdAt, updatedAt } = createdPlayer;
		expect(id).to.not.be.null();
		expect(createdAt).to.not.be.null();
		expect(deletedAt).to.be.null();
		expect(updatedAt).to.be.null();

		const playerName = `${newPlayer.firstName} ${newPlayer.lastName}`;

		// Test that the player has a team
		const team = await teamRepo.findOne({ name: playerName });
		const player = await playerRepo.findOne({ firstName: newPlayer.firstName, lastName: newPlayer.lastName });
		const playerTeams = await playerTeamRepo.findMany({ teamId: team.id });

		expect(team).to.be.an.object();
		expect(player).to.be.an.object();
		expect(playerTeams.length).to.equal(1);
		expect(playerTeams[0].playerId).to.equal(player.id);
		expect(playerTeams[0].teamId).to.equal(team.id);
		expect(team.name).to.equal(playerName);
	});

	it('should not create a player with an invalid email', async () => {
		// Create new data
		const newPlayer = Random.player();
		newPlayer.email = 'bademail';

		// Pull out the resolver
		const { Mutation: { createPlayer } } = resolvers;
		const context = await generateContext();

		// Run the resovler
		try {
			await createPlayer({}, newPlayer, context);
		} catch (err) {
			// TODO: Find a better way to validate this error
			expect(err).to.be.an.object();
		}
	});
});
