'use strict';

const { validationResult } = require('express-validator');
const { generateMystery } = require('../services/geminiService');
const { calculateScore } = require('../services/scoringService');
const { DIFFICULTY_CONFIG } = require('../services/mysteryValidator');
const Case = require('../models/Case');

// ── Public serializers ────────────────────────────────────────────────────────

/**
 * Returns the public view of a case (hides culprit & solution).
 * Locked clues show only id/title/category/evidenceType/status.
 * Discovered clues show all fields + status.
 * Only already-revealed hint texts are included.
 */
function serializePublicCase(caseDoc) {
  const c = caseDoc.toObject ? caseDoc.toObject() : caseDoc;
  const discovered = new Set(c.progress?.discoveredClueIds || []);
  const hintsUsed = c.progress?.hintsUsed || 0;
  const cfg = DIFFICULTY_CONFIG[c.difficulty];

  const clues = (c.clues || []).map((clue) => {
    if (discovered.has(clue.id)) {
      return {
        id: clue.id,
        title: clue.title,
        category: clue.category,
        content: clue.content,
        evidenceType: clue.evidenceType,
        relevance: clue.relevance,
        status: 'discovered',
      };
    }
    return {
      id: clue.id,
      title: clue.title,
      category: clue.category,
      evidenceType: clue.evidenceType,
      status: 'locked',
    };
  });

  const revealedHints = (c.hints || []).slice(0, hintsUsed);

  return {
    id: c._id,
    title: c.title,
    story: c.story,
    difficulty: c.difficulty,
    status: c.status,
    suspects: (c.suspects || []).map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      profile: s.profile,
      alibi: s.alibi,
    })),
    clues,
    discoveredClueIds: [...discovered],
    hintsUsed,
    hintsRemaining: Math.max(0, (cfg?.hints || 0) - hintsUsed),
    revealedHints,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

/**
 * Returns the full result view (after accusation), including solution.
 */
function serializeResult(caseDoc) {
  const pub = serializePublicCase(caseDoc);
  const c = caseDoc.toObject ? caseDoc.toObject() : caseDoc;

  return {
    ...pub,
    isCorrect: c.accusation?.isCorrect,
    accusation: c.accusation,
    score: c.score,
    solution: c.solution,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function validationError(res, details) {
  return res.status(400).json({
    error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details },
  });
}

function handleValidationResult(req, res) {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationError(res, errors.array().map((e) => ({ field: e.path, message: e.msg })));
    return true;
  }
  return false;
}

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/cases
 * Generate a new mystery case via Gemini.
 */
async function createCase(req, res, next) {
  try {
    if (handleValidationResult(req, res)) return;

    const { premise, difficulty } = req.body;

    const mysteryData = await generateMystery(premise, difficulty);

    const newCase = await Case.create({
      premise,
      title: mysteryData.title,
      story: mysteryData.story,
      difficulty,
      suspects: mysteryData.suspects,
      clues: mysteryData.clues,
      hints: mysteryData.hints,
      solution: {
        culpritSuspectId: mysteryData.culpritSuspectId,
        motive: mysteryData.solution.motive,
        method: mysteryData.solution.method,
        explanation: mysteryData.solution.explanation,
        clueReasoning: mysteryData.solution.clueReasoning,
        alternativeSuspectExplanations: mysteryData.solution.alternativeSuspectExplanations,
      },
      progress: { discoveredClueIds: [], hintsUsed: 0 },
      status: 'active',
      userId: req.user ? req.user._id : null,
    });

    return res.status(201).json(serializePublicCase(newCase));
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/cases/:id
 * Get the public view of an active case.
 */
async function getCase(req, res, next) {
  try {
    if (handleValidationResult(req, res)) return;

    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Case not found', details: [] },
      });
    }

    return res.json(serializePublicCase(caseDoc));
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/cases/:id/clues/:clueId/discover
 * Mark a clue as discovered.
 */
async function discoverClue(req, res, next) {
  try {
    if (handleValidationResult(req, res)) return;

    const { id, clueId } = req.params;

    const caseDoc = await Case.findById(id);
    if (!caseDoc) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Case not found', details: [] },
      });
    }

    if (caseDoc.status !== 'active') {
      return res.status(409).json({
        error: { code: 'CASE_ALREADY_COMPLETED', message: 'This case is already completed', details: [] },
      });
    }

    const clueExists = caseDoc.clues.some((c) => c.id === clueId);
    if (!clueExists) {
      return res.status(404).json({
        error: { code: 'CLUE_NOT_FOUND', message: 'Clue not found in this case', details: [] },
      });
    }

    const alreadyDiscovered = caseDoc.progress.discoveredClueIds.includes(clueId);
    if (!alreadyDiscovered) {
      caseDoc.progress.discoveredClueIds.push(clueId);
      await caseDoc.save();
    }

    return res.json(serializePublicCase(caseDoc));
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/cases/:id/hints
 * Reveal the next hint.
 */
async function requestHint(req, res, next) {
  try {
    if (handleValidationResult(req, res)) return;

    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Case not found', details: [] },
      });
    }

    if (caseDoc.status !== 'active') {
      return res.status(409).json({
        error: { code: 'CASE_ALREADY_COMPLETED', message: 'This case is already completed', details: [] },
      });
    }

    const cfg = DIFFICULTY_CONFIG[caseDoc.difficulty];
    const maxHints = cfg?.hints || 0;

    if (caseDoc.progress.hintsUsed >= maxHints) {
      return res.status(409).json({
        error: {
          code: 'NO_HINTS_REMAINING',
          message: `No hints remaining. Maximum hints for ${caseDoc.difficulty} difficulty is ${maxHints}.`,
          details: [],
        },
      });
    }

    caseDoc.progress.hintsUsed += 1;
    await caseDoc.save();

    return res.json(serializePublicCase(caseDoc));
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/cases/:id/accuse
 * Submit an accusation. Finalises the case.
 */
async function submitAccusation(req, res, next) {
  try {
    if (handleValidationResult(req, res)) return;

    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Case not found', details: [] },
      });
    }

    if (caseDoc.status !== 'active') {
      return res.status(409).json({
        error: {
          code: 'CASE_ALREADY_COMPLETED',
          message: 'An accusation has already been submitted for this case',
          details: [],
        },
      });
    }

    const { suspectId } = req.body;

    const suspectExists = caseDoc.suspects.some((s) => s.id === suspectId);
    if (!suspectExists) {
      return res.status(400).json({
        error: {
          code: 'INVALID_SUSPECT',
          message: 'The provided suspectId does not match any suspect in this case',
          details: [],
        },
      });
    }

    const isCorrect = caseDoc.solution.culpritSuspectId === suspectId;

    const score = calculateScore({
      correctAccusation: isCorrect,
      difficulty: caseDoc.difficulty,
      discoveredClueIds: caseDoc.progress.discoveredClueIds,
      hintsUsed: caseDoc.progress.hintsUsed,
    });

    caseDoc.accusation = { suspectId, isCorrect, submittedAt: new Date() };
    caseDoc.score = score;
    caseDoc.status = 'completed';
    await caseDoc.save();

    // Update user stats if case belongs to an authenticated user
    if (caseDoc.userId) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(caseDoc.userId, {
        $inc: {
          'stats.casesPlayed': 1,
          'stats.casesSolved': isCorrect ? 1 : 0,
          'stats.totalScore': score.total,
        },
      }).catch((e) => console.warn('Failed to update user stats:', e.message));
    }

    return res.json(serializeResult(caseDoc));
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/cases/:id/result
 * Get the full result including solution (only after accusation).
 */
async function getCaseResult(req, res, next) {
  try {
    if (handleValidationResult(req, res)) return;

    const caseDoc = await Case.findById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Case not found', details: [] },
      });
    }

    if (caseDoc.status !== 'completed') {
      return res.status(409).json({
        error: {
          code: 'CASE_NOT_COMPLETED',
          message: 'Results are only available after an accusation has been submitted',
          details: [],
        },
      });
    }

    return res.json(serializeResult(caseDoc));
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/health
 * Simple health check.
 */
function healthCheck(req, res) {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
}

module.exports = {
  createCase,
  getCase,
  discoverClue,
  requestHint,
  submitAccusation,
  getCaseResult,
  healthCheck,
};
