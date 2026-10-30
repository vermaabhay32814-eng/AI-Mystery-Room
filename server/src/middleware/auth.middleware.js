// server/src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { sendError } from '../utils/response.js';

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return sendError(res, 'Authentication required to access this resource', 'UNAUTHORIZED', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired authentication session', 'UNAUTHORIZED', 401);
  }
};

export const optionalAuth = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
    } catch (err) {
      // Ignore token failure for optional endpoints
    }
  }
  next();
};
