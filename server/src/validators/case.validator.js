// server/src/validators/case.validator.js
import { z } from 'zod';

export const createCaseSchema = z.object({
  scenario: z
    .string()
    .min(50, 'Scenario must be at least 50 characters long')
    .max(2000, 'Scenario cannot exceed 2,000 characters'),
  genre: z
    .enum(['theft', 'murder', 'missing_person', 'cyber', 'corporate', 'general'])
    .default('general'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .default('medium'),
  suspectCount: z
    .number()
    .int()
    .min(3, 'At least 3 suspects are required')
    .max(6, 'At most 6 suspects allowed')
    .default(4),
  evidenceDensity: z
    .enum(['light', 'standard', 'detailed'])
    .default('standard'),
  title: z
    .string()
    .max(150, 'Title cannot exceed 150 characters')
    .optional()
});
