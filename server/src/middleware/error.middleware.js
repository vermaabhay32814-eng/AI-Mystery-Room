// server/src/middleware/error.middleware.js
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled server exception caught by error middleware:', err);

  if (err.name === 'ZodError') {
    return sendError(
      res,
      'Validation error: ' + err.errors.map((e) => e.message).join(', '),
      'VALIDATION_ERROR',
      400,
      err.errors
    );
  }

  if (err.name === 'CastError') {
    return sendError(res, 'Invalid identifier format', 'INVALID_ID', 400);
  }

  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'An unexpected internal error occurred' : err.message,
    'INTERNAL_SERVER_ERROR',
    err.statusCode || 500
  );
};

