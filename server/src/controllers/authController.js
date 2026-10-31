'use strict';

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Case = require('../models/Case');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate a JWT token for a user.
 */
function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Register a new user.
 */
async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please check your registration details.',
          details: errors.array().map((e) => ({
            field: e.path,
            message: e.msg,
          })),
        },
      });
    }

    const { username, email, password } = req.body;

    // Check for existing user by email or username
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'An account with this email address already exists.',
          details: [{ field: 'email', message: 'Email is already registered' }],
        },
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        error: {
          code: 'USERNAME_ALREADY_TAKEN',
          message: 'This username is already taken. Please choose another.',
          details: [{ field: 'username', message: 'Username is already taken' }],
        },
      });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Registration successful!',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Log in an existing user.
 */
async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid login details.',
          details: errors.array().map((e) => ({
            field: e.path,
            message: e.msg,
          })),
        },
      });
    }

    const { emailOrUsername, password } = req.body;

    // Search by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername },
      ],
    });

    if (!user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Incorrect email/username or password.',
        },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Incorrect email/username or password.',
        },
      });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login successful!',
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get profile of currently authenticated user.
 */
async function getMe(req, res, next) {
  try {
    return res.json({
      user: req.user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get cases belonging to the authenticated user.
 */
async function getMyCases(req, res, next) {
  try {
    const cases = await Case.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('title premise difficulty status score accusation createdAt updatedAt');

    const serializedCases = cases.map((c) => ({
      id: c._id,
      title: c.title,
      premise: c.premise,
      difficulty: c.difficulty,
      status: c.status,
      score: c.score,
      isCorrect: c.accusation?.isCorrect,
      createdAt: c.createdAt,
    }));

    return res.json({ cases: serializedCases });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe,
  getMyCases,
};

