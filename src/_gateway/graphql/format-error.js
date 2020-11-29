const { formatError: formatApolloError, isInstance, createError } = require('apollo-errors');
const _ = require('lodash');
const log = require('../../utils/logger')();

const BadRequestError = createError('BadRequestError', {
	message: 'A bad request was detected'
});

const UnauthorizedError = createError('UnauthorizedError', {
	message: 'Unauthorized'
});

const UnknownError = createError('UnknownError', {
	message: 'An unexpected error has occurred'
});

const DownstreamError = createError('Downstream Error', {
	message: 'An error occurred in a downstream service'
});


class ServerError {
	constructor (err) { this.err = err; }

	get isValidationError() {
		return _.get(this.err, [ 'extensions', 'exception', 'isJoi' ], false);
	}

	get isApolloError() {
		return isInstance(this.err.originalError);
	}

	get validationErrors() {
		const details = _.get(this.err, [ 'extensions', 'exception', 'details' ], []);

		return details.map(detail => detail.message.split('\"').join(''));
	}

	get message() {
		return this.err.message;
	}

	get stackTrace() {
		return _.get(this.err, [ 'extensions', 'exception', 'stacktrace' ], []);
	}
}

module.exports = err => {
	log.error(`-- Error: ${JSON.stringify(err, null, 2)} --`);
	const error = new ServerError(err);

	if (error.isApolloError) {
		return formatApolloError(err);
	}

	if (error.isValidationError) {
		return formatApolloError(new BadRequestError({
			data: {
				validationErrors: error.validationErrors
			}
		}));
	}

	if (error.isUnauthorizedError) {
		return formatApolloError(new UnauthorizedError({
			data: {
				message: 'You are not authorized to perform this action.'
			}
		}));
	}

	if (err.extensions.code === 'DOWNSTREAM_SERVICE_ERROR') {
		return formatApolloError(new DownstreamError({
			data: {
				message: err.message
			}
		}))
	}

	return formatApolloError(new UnknownError({
		data: {
			message: error.message
		}
	}));
};
