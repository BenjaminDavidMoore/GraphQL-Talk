const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, beforeEach } = lab;

const { resetDB, Random, insert, deepEqual, generateContext } = require('../../../helpers');
const { expect } = require('code');

const resolvers = require(`${process.cwd()}/src/graphql/match/match.resolver`);

describe('Submit Match', () => {

	beforeEach(() => {
		return resetDB();
	});

	it('should create a match and calculate rankings', async () => {
		// Create new data
		const playerA = Random.player();
		const playerB = Random.player();
		const teamA = Random.team({ hidden: false });
		const teamB = Random.team({ hidden: true });
		const game = Random.game();
		const playerTeamA = Random.playerTeam({ team: teamA, player: playerA });
		const playerTeamB = Random.playerTeam({ team: teamB, player: playerB });
		const teamARatingBefore = Random.integer({ min: 1000, max: 1500 });
		const teamBRatingBefore = Random.integer({ min: 1500, max: 2000 });
		const ratingA = Random.rating({ game, team: teamA, rating: teamARatingBefore });
		const ratingB = Random.rating({ game, team: teamB, rating: teamBRatingBefore });
		const oldMatches = Random.n(() => Random.match({
			game,
			teamA,
			teamB,
			winner: Random.pickone([ teamA, teamB ]),
			submittedBy: Random.pickone([ playerA, playerB ]),
			playedAt: Random.date(),
			teamARatingBefore,
			teamBRatingBefore
		}), 5);
		const match = Random.match({
			game,
			teamA,
			teamB,
			winner: teamA,
			submittedBy: playerB,
			teamARatingBefore,
			teamBRatingBefore
		});
		delete match.id;

		// Slap er in the db
		await insert('players', [ playerA, playerB ]);
		await insert('teams', [ teamA, teamB ]);
		await insert('games', game);
		await insert('players_teams', [ playerTeamA, playerTeamB ]);
		await insert('ratings', [ ratingA, ratingB ]);
		await insert('matches', oldMatches);

		// Pull out the resolver
		const { Mutation: { submitMatch } } = resolvers;
		const context = await generateContext();

		// Run the resovler
		const result = await submitMatch({}, { input: match }, context);

		// Test the format of the response
		expect(result).to.be.an.object();
		expect(deepEqual(match, result)).to.equal(true);

		// TODO: Retrieve and validate the new ratings

		// Make sure that the rantings were calculated properly... or at least in the right directions
		expect(result.teamARatingBefore).to.equal(ratingA.rating);
		expect(result.teamBRatingBefore).to.equal(ratingB.rating);

		// Make sure that
	});
});
