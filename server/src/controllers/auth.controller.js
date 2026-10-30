// server/src/controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { config } from '../config/env.js';
import { sendSuccess, sendError } from '../utils/response.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: config.env === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

const signToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

export const register = async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, parseResult.error.errors[0].message, 'VALIDATION_ERROR', 400);
    }

    const { name, email, password } = parseResult.data;
    const existing = await User.findOne({ email });
    if (existing) {
      return sendError(res, 'An account with this email address already exists', 'EMAIL_IN_USE', 400);
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = signToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);

    return sendSuccess(res, { user: user.toJSON() }, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, parseResult.error.errors[0].message, 'VALIDATION_ERROR', 400);
    }

    const { email, password } = parseResult.data;
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'Invalid email or password credentials', 'INVALID_CREDENTIALS', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password credentials', 'INVALID_CREDENTIALS', 401);
    }

    const token = signToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);

    return sendSuccess(res, { user: user.toJSON() }, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  return sendSuccess(res, {}, 'Logged out successfully');
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User session not found', 'NOT_FOUND', 404);
    }
    return sendSuccess(res, { user: user.toJSON() }, 'Current user profile');
  } catch (err) {
    next(err);
  }
};

