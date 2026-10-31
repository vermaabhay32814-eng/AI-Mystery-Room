'use strict';

/**
 * 404 Not Found handler — must be registered after all routes.
 */
function notFound(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      details: [],
    },
  });
}

module.exports = notFound;
