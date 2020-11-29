const path = require('path');
const gql = require('graphql-tag');

const { fileLoader, mergeTypes } = require('merge-graphql-schemas');

const { schema: directives } = require('./directives');

// Require the schemas through out the application
// Add the schema directive definitions to the other schemas
const schemas = fileLoader(path.join(__dirname, './**/*.schema.graphql'));
// schemas.push(directives);

// Merge the differrent schemas into one large schema
module.exports = gql`${schemas}`;
