// server/src/routes/investigation.routes.js
import { Router } from 'express';
import {
  listEvidenceHandler,
  getEvidenceItemHandler,
  getProgressHandler,
  updateProgressHandler,
  submitAccusationHandler,
  getResultHandler
} from '../controllers/investigation.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router({ mergeParams: true });

router.get('/evidence', optionalAuth, listEvidenceHandler);
router.get('/evidence/:evidenceId', optionalAuth, getEvidenceItemHandler);
router.get('/progress', optionalAuth, getProgressHandler);
router.patch('/progress', optionalAuth, updateProgressHandler);
router.post('/accusation', optionalAuth, submitAccusationHandler);
router.get('/result', optionalAuth, getResultHandler);

export default router;

