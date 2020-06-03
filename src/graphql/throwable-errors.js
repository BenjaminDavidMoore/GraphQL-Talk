const { createError } = require('apollo-errors');

const UnknownError = createError('UnknownError', {
	message: 'An unknown error has occurred. Please try again later.'
});

const UnauthenticatedError = createError('UnauthenticatedError', {
	message: 'Authentication is required to view this resource.'
});

const NotFoundError = createError('NotFoundError', {
	message: 'Resource not found.'
});

const ForbiddenError = createError('ForbiddenError', {
	message: 'Cannot perform this action.'
});

const ConflictError = createError('ConflictError', {
	message: 'Cannot perform this action.'
});

const BadRequest = createError('BadRequest', {
	message: 'Request is not valid.'
});

module.exports = {
	UnknownError,
	UnauthenticatedError,
	NotFoundError,
	ForbiddenError,
	ConflictError,
	BadRequest
};
