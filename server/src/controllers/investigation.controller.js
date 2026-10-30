// server/src/controllers/investigation.controller.js
import { Case } from '../models/Case.js';
import { InvestigationProgress } from '../models/InvestigationProgress.js';
import { accusationSchema, updateProgressSchema } from '../validators/investigation.validator.js';
import { sanitizeEvidenceForPlayer } from '../services/evidence.service.js';
import { calculateScore } from '../services/scoring.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const listEvidenceHandler = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const mysteryCase = await Case.findById(caseId);

    if (!mysteryCase) {
      return sendError(res, 'Case not found', 'CASE_NOT_FOUND', 404);
    }

    const publicEvidence = sanitizeEvidenceForPlayer(mysteryCase.publicCase.evidence);
    return sendSuccess(res, { evidence: publicEvidence });
  } catch (err) {
    next(err);
  }
};

export const getEvidenceItemHandler = async (req, res, next) => {
  try {
    const { caseId, evidenceId } = req.params;
    const mysteryCase = await Case.findById(caseId);

    if (!mysteryCase) {
      return sendError(res, 'Case not found', 'CASE_NOT_FOUND', 404);
    }

    const item = mysteryCase.publicCase.evidence.find((e) => e.id === evidenceId);
    if (!item) {
      return sendError(res, 'Evidence artifact not found in this case', 'EVIDENCE_NOT_FOUND', 404);
    }

    const [sanitized] = sanitizeEvidenceForPlayer([item]);
    return sendSuccess(res, { evidence: sanitized });
  } catch (err) {
    next(err);
  }
};

export const getProgressHandler = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const userId = req.user?.id || null;

    let progress = await InvestigationProgress.findOne({ caseId, userId });
    if (!progress) {
      progress = new InvestigationProgress({
        caseId,
        userId,
        openedEvidenceIds: [],
        notes: []
      });
      await progress.save();
    }

    return sendSuccess(res, { progress });
  } catch (err) {
    next(err);
  }
};

export const updateProgressHandler = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const userId = req.user?.id || null;

    const parseResult = updateProgressSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, parseResult.error.errors[0].message, 'VALIDATION_ERROR', 400);
    }

    const { openedEvidenceId, notes } = parseResult.data;

    let progress = await InvestigationProgress.findOne({ caseId, userId });
    if (!progress) {
      progress = new InvestigationProgress({
        caseId,
        userId,
        openedEvidenceIds: [],
        notes: []
      });
    }

    if (openedEvidenceId && !progress.openedEvidenceIds.includes(openedEvidenceId)) {
      progress.openedEvidenceIds.push(openedEvidenceId);
    }

    if (notes) {
      progress.notes = notes;
    }

    await progress.save();
    return sendSuccess(res, { progress }, 'Progress updated');
  } catch (err) {
    next(err);
  }
};

export const submitAccusationHandler = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const userId = req.user?.id || null;

    const parseResult = accusationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, parseResult.error.errors[0].message, 'VALIDATION_ERROR', 400);
    }

    const { suspectId } = parseResult.data;
    const mysteryCase = await Case.findById(caseId);

    if (!mysteryCase) {
      return sendError(res, 'Case not found', 'CASE_NOT_FOUND', 404);
    }

    // Verify suspect exists in roster
    const suspect = mysteryCase.publicCase.suspects.find((s) => s.id === suspectId);
    if (!suspect) {
      return sendError(res, 'Invalid suspect selected', 'INVALID_SUSPECT', 400);
    }

    let progress = await InvestigationProgress.findOne({ caseId, userId });
    if (!progress) {
      progress = new InvestigationProgress({ caseId, userId, openedEvidenceIds: [], notes: [] });
    }

    if (progress.status === 'completed') {
      return sendError(res, 'An accusation has already been evaluated for this case', 'ALREADY_SUBMITTED', 400);
    }

    // Compare with canonical culprit
    const isCorrect = mysteryCase.privateSolution.culpritSuspectId === suspectId;

    // Calculate score
    const scoreResult = calculateScore({
      isCorrect,
      totalEvidenceCount: mysteryCase.publicCase.evidence.length,
      openedEvidenceIds: progress.openedEvidenceIds,
      decisiveEvidenceIds: mysteryCase.privateSolution.decisiveEvidenceIds
    });

    const realCulprit = mysteryCase.publicCase.suspects.find(
      (s) => s.id === mysteryCase.privateSolution.culpritSuspectId
    );

    const feedback = isCorrect
      ? `Brilliant deduction! You identified ${suspect.name} as the true culprit.`
      : `Accusation incorrect. ${suspect.name} was not the culprit. The true perpetrator was ${realCulprit?.name || 'unknown'}.`;

    progress.selectedSuspectId = suspectId;
    progress.submittedAt = new Date();
    progress.status = 'completed';
    progress.result = {
      isCorrect,
      score: scoreResult.score,
      breakdown: scoreResult.breakdown,
      feedback
    };
    await progress.save();

    mysteryCase.status = 'completed';
    mysteryCase.completedAt = new Date();
    await mysteryCase.save();

    // Now permitted to reveal solution
    return sendSuccess(res, {
      result: progress.result,
      selectedSuspect: suspect,
      realCulprit,
      solution: {
        motive: mysteryCase.privateSolution.motive,
        method: mysteryCase.privateSolution.method,
        opportunity: mysteryCase.privateSolution.opportunity,
        explanation: mysteryCase.privateSolution.explanation,
        decisiveEvidenceIds: mysteryCase.privateSolution.decisiveEvidenceIds,
        redHerringExplanations: mysteryCase.privateSolution.redHerringExplanations
      }
    }, 'Accusation evaluated');
  } catch (err) {
    next(err);
  }
};

export const getResultHandler = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const userId = req.user?.id || null;

    const progress = await InvestigationProgress.findOne({ caseId, userId });
    if (!progress || progress.status !== 'completed') {
      return sendError(res, 'Solution cannot be disclosed before an accusation is submitted', 'FORBIDDEN', 403);
    }

    const mysteryCase = await Case.findById(caseId);
    if (!mysteryCase) {
      return sendError(res, 'Case not found', 'CASE_NOT_FOUND', 404);
    }

    const realCulprit = mysteryCase.publicCase.suspects.find(
      (s) => s.id === mysteryCase.privateSolution.culpritSuspectId
    );
    const selectedSuspect = mysteryCase.publicCase.suspects.find(
      (s) => s.id === progress.selectedSuspectId
    );

    return sendSuccess(res, {
      result: progress.result,
      selectedSuspect,
      realCulprit,
      solution: {
        motive: mysteryCase.privateSolution.motive,
        method: mysteryCase.privateSolution.method,
        opportunity: mysteryCase.privateSolution.opportunity,
        explanation: mysteryCase.privateSolution.explanation,
        decisiveEvidenceIds: mysteryCase.privateSolution.decisiveEvidenceIds,
        redHerringExplanations: mysteryCase.privateSolution.redHerringExplanations
      }
    });
  } catch (err) {
    next(err);
  }
};

