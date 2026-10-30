// server/src/controllers/case.controller.js
import { Case } from '../models/Case.js';
import { InvestigationProgress } from '../models/InvestigationProgress.js';
import { createCaseSchema } from '../validators/case.validator.js';
import { generateCase } from '../services/case-generation.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const createCaseHandler = async (req, res, next) => {
  try {
    const parseResult = createCaseSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, parseResult.error.errors[0].message, 'VALIDATION_ERROR', 400);
    }

    const { scenario, genre, difficulty, suspectCount, evidenceDensity, title } = parseResult.data;
    const userId = req.user?.id || null;

    // Trigger case generation
    const mysteryCase = await generateCase({
      scenario,
      genre,
      difficulty,
      suspectCount,
      evidenceDensity,
      userId,
      title
    });

    return sendSuccess(
      res,
      {
        caseId: mysteryCase._id,
        title: mysteryCase.title,
        status: mysteryCase.status,
        case: mysteryCase.toPublicJSON()
      },
      'Case generated successfully',
      201
    );
  } catch (err) {
    logger.error('Failed to create case:', err);
    next(err);
  }
};

export const listCasesHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page || '1', 10);
    const limit = Math.min(50, parseInt(req.query.limit || '10', 10));
    const skip = (page - 1) * limit;

    const query = { ownerId: userId };
    const [cases, total] = await Promise.all([
      Case.find(query)
        .select('title originalScenario genre difficulty status createdAt updatedAt completedAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Case.countDocuments(query)
    ]);

    return sendSuccess(res, {
      cases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getCaseByIdHandler = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const mysteryCase = await Case.findById(caseId);

    if (!mysteryCase) {
      return sendError(res, 'Mystery case not found', 'CASE_NOT_FOUND', 404);
    }

    // If case has an owner and user is logged in, check ownership (or allow public guest case)
    if (mysteryCase.ownerId && req.user && mysteryCase.ownerId.toString() !== req.user.id) {
      return sendError(res, 'Access denied to this private investigation', 'FORBIDDEN', 403);
    }

    // Always strip private solution data using toPublicJSON()
    return sendSuccess(res, { case: mysteryCase.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

export const getCaseStatusHandler = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const mysteryCase = await Case.findById(caseId).select('status errorMessage title');

    if (!mysteryCase) {
      return sendError(res, 'Case not found', 'CASE_NOT_FOUND', 404);
    }

    return sendSuccess(res, {
      status: mysteryCase.status,
      errorMessage: mysteryCase.errorMessage,
      title: mysteryCase.title
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCaseHandler = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const mysteryCase = await Case.findById(caseId);

    if (!mysteryCase) {
      return sendError(res, 'Case not found', 'CASE_NOT_FOUND', 404);
    }

    if (mysteryCase.ownerId && (!req.user || mysteryCase.ownerId.toString() !== req.user.id)) {
      return sendError(res, 'You do not have permission to delete this case', 'FORBIDDEN', 403);
    }

    await Promise.all([
      Case.findByIdAndDelete(caseId),
      InvestigationProgress.deleteMany({ caseId })
    ]);

    return sendSuccess(res, { deletedCaseId: caseId }, 'Case deleted successfully');
  } catch (err) {
    next(err);
  }
};

