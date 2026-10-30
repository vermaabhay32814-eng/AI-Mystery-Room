// server/src/routes/index.js
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import caseRoutes from './case.routes.js';
import investigationRoutes from './investigation.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cases', caseRoutes);
router.use('/cases/:caseId', investigationRoutes);
router.use('/health', healthRoutes);

export default router;

