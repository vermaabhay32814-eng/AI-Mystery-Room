'use strict';

/**
 * Global error handler — must be registered as the last middleware.
 * Formats all errors into the standard error envelope.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  console.error('[Error]', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Database validation failed', details },
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      error: { code: 'INVALID_ID', message: 'Invalid resource ID format', details: [] },
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      error: { code: 'DUPLICATE_KEY', message: 'A resource with this value already exists', details: [] },
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected error occurred'
      : err.message || 'An unexpected error occurred';

  return res.status(statusCode).json({
    error: { code, message, details: [] },
  });
}

module.exports = errorHandler;
