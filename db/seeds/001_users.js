const Random = require(`${process.cwd()}/utils/random`);

exports.seed = knex => knex('users').insert(Random.n(Random.user, 5));
