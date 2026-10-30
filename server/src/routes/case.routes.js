// server/src/routes/case.routes.js
import { Router } from 'express';
import {
  createCaseHandler,
  listCasesHandler,
  getCaseByIdHandler,
  getCaseStatusHandler,
  deleteCaseHandler
} from '../controllers/case.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';
import { caseGenerationLimiter } from '../middleware/rate-limiter.middleware.js';

const router = Router();

// Generation route accepts authenticated users or optional guest demo
router.post('/', caseGenerationLimiter, optionalAuth, createCaseHandler);

// User-specific case routes
router.get('/', requireAuth, listCasesHandler);
router.get('/:caseId', optionalAuth, getCaseByIdHandler);
router.get('/:caseId/status', getCaseStatusHandler);
router.delete('/:caseId', optionalAuth, deleteCaseHandler);

export default router;

