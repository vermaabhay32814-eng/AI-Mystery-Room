'use strict';

const { body, param } = require('express-validator');

/**
 * Validation rules for POST /api/cases
 */
const validateCreateCase = [
  body('premise')
    .isString()
    .withMessage('premise must be a string')
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage('premise must be between 20 and 500 characters'),

  body('difficulty')
    .isString()
    .withMessage('difficulty must be a string')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('difficulty must be one of: easy, medium, hard'),
];

/**
 * Validation rules for routes with :id param
 */
const validateCaseId = [
  param('id')
    .isMongoId()
    .withMessage('id must be a valid MongoDB ObjectId'),
];

/**
 * Validation rules for POST /api/cases/:id/clues/:clueId/discover
 */
const validateDiscover = [
  ...validateCaseId,
  param('clueId')
    .isString()
    .notEmpty()
    .withMessage('clueId must be a non-empty string'),
];

/**
 * Validation rules for POST /api/cases/:id/accuse
 */
const validateAccuse = [
  ...validateCaseId,
  body('suspectId')
    .isString()
    .withMessage('suspectId must be a string')
    .trim()
    .notEmpty()
    .withMessage('suspectId is required'),
];

module.exports = {
  validateCreateCase,
  validateCaseId,
  validateDiscover,
  validateAccuse,
};
