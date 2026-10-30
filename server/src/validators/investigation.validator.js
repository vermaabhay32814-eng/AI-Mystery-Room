// server/src/validators/investigation.validator.js
import { z } from 'zod';

export const accusationSchema = z.object({
  suspectId: z.string().min(1, 'A suspect must be selected for accusation')
});

export const updateProgressSchema = z.object({
  openedEvidenceId: z.string().optional(),
  notes: z
    .array(
      z.object({
        id: z.string(),
        content: z.string().max(5000, 'Note content cannot exceed 5,000 characters'),
        createdAt: z.string().or(z.date()).optional(),
        updatedAt: z.string().or(z.date()).optional()
      })
    )
    .optional()
});
