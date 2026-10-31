'use strict';

const rateLimit = require('express-rate-limit');

/**
 * Factory that creates a standard rate limiter with a shared error format.
 */
function createLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          details: [],
        },
      });
    },
  });
}

/** General limiter: 100 requests per 15 minutes */
const generalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.',
});

/** Case creation limiter: 5 per 15 minutes per IP */
const createCaseLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many mystery generation requests. Please wait before generating another.',
});

/** Hint limiter: 20 per 15 minutes per IP */
const hintLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many hint requests. Please wait before requesting more hints.',
});

module.exports = { generalLimiter, createCaseLimiter, hintLimiter };
