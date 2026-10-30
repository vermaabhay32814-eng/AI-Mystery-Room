// server/src/services/case-validation.service.js
import { blueprintSchema, evidenceListSchema } from '../validators/gemini-output.validator.js';
import { logger } from '../utils/logger.js';

export const validateCaseData = ({ blueprint, evidenceList }) => {
  const errors = [];

  // 1. Zod schema validation
  const blueprintResult = blueprintSchema.safeParse(blueprint);
  if (!blueprintResult.success) {
    errors.push(`Blueprint validation failed: ${JSON.stringify(blueprintResult.error.format())}`);
  }

  const evidenceResult = evidenceListSchema.safeParse(evidenceList);
  if (!evidenceResult.success) {
    errors.push(`Evidence validation failed: ${JSON.stringify(evidenceResult.error.format())}`);
  }

  if (errors.length > 0) {
    logger.warn('Case validation schema errors found', { errors });
    return { isValid: false, errors };
  }

  // 2. Referential integrity: Check that culprit exists in suspects roster
  const suspectIds = new Set(blueprint.suspects.map((s) => s.id));
  if (!suspectIds.has(blueprint.solution.culpritSuspectId)) {
    errors.push(`Culprit ID "${blueprint.solution.culpritSuspectId}" does not match any suspect in the roster`);
  }

  // 3. Check for at least two decisive clues/evidence
  const decisiveEvidence = evidenceList.filter((e) => e.isDecisive);
  if (decisiveEvidence.length < 2) {
    errors.push(`Case requires at least 2 decisive evidence items, found ${decisiveEvidence.length}`);
  }

  // 4. Evidence IDs must be unique
  const evidenceIds = new Set();
  for (const item of evidenceList) {
    if (evidenceIds.has(item.id)) {
      errors.push(`Duplicate evidence ID detected: ${item.id}`);
    }
    evidenceIds.add(item.id);
  }

  // 5. Check linked suspects exist
  for (const ev of evidenceList) {
    for (const linkedId of ev.linkedSuspectIds || []) {
      if (!suspectIds.has(linkedId)) {
        errors.push(`Evidence "${ev.id}" links to non-existent suspect "${linkedId}"`);
      }
    }
  }

  const isValid = errors.length === 0;
  if (!isValid) {
    logger.warn('Deterministic case validation failed', { errors });
  }

  return {
    isValid,
    errors
  };
};

