'use strict';

/**
 * Difficulty configuration for mystery generation and scoring.
 */
const DIFFICULTY_CONFIG = {
  easy:   { suspects: 3, clues: 5, hints: 2, basePoints: 100 },
  medium: { suspects: 4, clues: 7, hints: 3, basePoints: 150 },
  hard:   { suspects: 5, clues: 9, hints: 3, basePoints: 200 },
};

const VALID_EVIDENCE_TYPES = [
  'document',
  'chat_message',
  'witness_statement',
  'photo_description',
  'cctv_transcript',
  'audio_transcript',
  'timeline_record',
  'physical_evidence',
];

/**
 * Validates that the Gemini-generated mystery JSON is structurally correct
 * for the requested difficulty.
 *
 * @param {object} data   – Parsed JSON from Gemini
 * @param {string} difficulty – "easy" | "medium" | "hard"
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateMystery(data, difficulty) {
  const errors = [];
  const cfg = DIFFICULTY_CONFIG[difficulty];

  if (!cfg) {
    errors.push(`Unknown difficulty: ${difficulty}`);
    return { valid: false, errors };
  }

  // Top-level fields
  if (!data || typeof data !== 'object') {
    errors.push('Response is not a JSON object');
    return { valid: false, errors };
  }

  if (typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Missing or empty "title"');
  }

  if (typeof data.story !== 'string' || data.story.trim().length === 0) {
    errors.push('Missing or empty "story"');
  }

  // Suspects
  if (!Array.isArray(data.suspects)) {
    errors.push('"suspects" must be an array');
  } else {
    if (data.suspects.length !== cfg.suspects) {
      errors.push(
        `Expected ${cfg.suspects} suspects for ${difficulty}, got ${data.suspects.length}`
      );
    }
    data.suspects.forEach((s, i) => {
      ['id', 'name', 'role', 'profile', 'alibi'].forEach((field) => {
        if (typeof s[field] !== 'string' || s[field].trim().length === 0) {
          errors.push(`suspect[${i}].${field} is missing or empty`);
        }
      });
    });

    // Ensure unique suspect IDs
    const suspectIds = data.suspects.map((s) => s.id);
    const uniqueSuspectIds = new Set(suspectIds);
    if (uniqueSuspectIds.size !== suspectIds.length) {
      errors.push('Suspect IDs must be unique');
    }
  }

  // Clues
  if (!Array.isArray(data.clues)) {
    errors.push('"clues" must be an array');
  } else {
    if (data.clues.length !== cfg.clues) {
      errors.push(
        `Expected ${cfg.clues} clues for ${difficulty}, got ${data.clues.length}`
      );
    }
    data.clues.forEach((c, i) => {
      ['id', 'title', 'category', 'content', 'relevance'].forEach((field) => {
        if (typeof c[field] !== 'string' || c[field].trim().length === 0) {
          errors.push(`clue[${i}].${field} is missing or empty`);
        }
      });
      if (!VALID_EVIDENCE_TYPES.includes(c.evidenceType)) {
        errors.push(
          `clue[${i}].evidenceType "${c.evidenceType}" is not a valid evidence type`
        );
      }
    });

    // Ensure unique clue IDs
    const clueIds = data.clues.map((c) => c.id);
    const uniqueClueIds = new Set(clueIds);
    if (uniqueClueIds.size !== clueIds.length) {
      errors.push('Clue IDs must be unique');
    }
  }

  // Hints
  if (!Array.isArray(data.hints)) {
    errors.push('"hints" must be an array');
  } else if (data.hints.length !== cfg.hints) {
    errors.push(
      `Expected ${cfg.hints} hints for ${difficulty}, got ${data.hints.length}`
    );
  }

  // Culprit
  if (typeof data.culpritSuspectId !== 'string' || data.culpritSuspectId.trim().length === 0) {
    errors.push('Missing or empty "culpritSuspectId"');
  } else if (Array.isArray(data.suspects)) {
    const ids = data.suspects.map((s) => s.id);
    if (!ids.includes(data.culpritSuspectId)) {
      errors.push(
        `culpritSuspectId "${data.culpritSuspectId}" does not match any suspect id`
      );
    }
  }

  // Solution
  if (!data.solution || typeof data.solution !== 'object') {
    errors.push('Missing "solution" object');
  } else {
    ['motive', 'method', 'explanation'].forEach((field) => {
      if (
        typeof data.solution[field] !== 'string' ||
        data.solution[field].trim().length === 0
      ) {
        errors.push(`solution.${field} is missing or empty`);
      }
    });

    if (!Array.isArray(data.solution.clueReasoning)) {
      errors.push('solution.clueReasoning must be an array');
    }

    if (!Array.isArray(data.solution.alternativeSuspectExplanations)) {
      errors.push('solution.alternativeSuspectExplanations must be an array');
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateMystery, DIFFICULTY_CONFIG, VALID_EVIDENCE_TYPES };
