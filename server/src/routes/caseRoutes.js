'use strict';

const { Router } = require('express');
const {
  createCase,
  getCase,
  discoverClue,
  requestHint,
  submitAccusation,
  getCaseResult,
  healthCheck,
} = require('../controllers/caseController');

const {
  validateCreateCase,
  validateCaseId,
  validateDiscover,
  validateAccuse,
} = require('../validators/caseValidators');

const { createCaseLimiter, hintLimiter } = require('../middleware/rateLimiter');
const { optionalAuth } = require('../middleware/auth');

const router = Router();

// Health check (no auth, no rate limit)
router.get('/health', healthCheck);

// ── Case endpoints ────────────────────────────────────────────────────────────

// POST /api/cases — generate a mystery
router.post('/cases', createCaseLimiter, optionalAuth, validateCreateCase, createCase);

// GET /api/cases/:id — public case view
router.get('/cases/:id', validateCaseId, getCase);

// POST /api/cases/:id/clues/:clueId/discover — discover a clue
router.post('/cases/:id/clues/:clueId/discover', validateDiscover, discoverClue);

// POST /api/cases/:id/hints — request next hint
router.post('/cases/:id/hints', hintLimiter, validateCaseId, requestHint);

// POST /api/cases/:id/accuse — submit accusation
router.post('/cases/:id/accuse', validateAccuse, submitAccusation);

// GET /api/cases/:id/result — get result (only after accusation)
router.get('/cases/:id/result', validateCaseId, getCaseResult);

module.exports = router;
