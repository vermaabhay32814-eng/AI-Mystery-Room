// server/src/tests/scoring.test.js
import { describe, it, expect } from 'vitest';
import { calculateScore } from '../services/scoring.service.js';

describe('Scoring Service (SPEC.md Section 9.3)', () => {
  it('awards 100 points for correct culprit with all evidence and decisive clues explored', () => {
    const result = calculateScore({
      isCorrect: true,
      totalEvidenceCount: 5,
      openedEvidenceIds: ['ev_1', 'ev_2', 'ev_3', 'ev_4', 'ev_5'],
      decisiveEvidenceIds: ['ev_2', 'ev_5']
    });

    expect(result.score).toBe(100);
    expect(result.breakdown.culpritScore).toBe(70);
    expect(result.breakdown.evidenceScore).toBe(20);
    expect(result.breakdown.clueScore).toBe(10);
  });

  it('awards zero culprit points for incorrect accusation but preserves evidence exploration points', () => {
    const result = calculateScore({
      isCorrect: false,
      totalEvidenceCount: 4,
      openedEvidenceIds: ['ev_1', 'ev_2'],
      decisiveEvidenceIds: ['ev_3', 'ev_4']
    });

    expect(result.breakdown.culpritScore).toBe(0);
    expect(result.breakdown.evidenceScore).toBe(10); // 2/4 = 50% of 20 = 10
    expect(result.breakdown.clueScore).toBe(0);
    expect(result.score).toBe(10);
  });

  it('calculates partial clue score when only some decisive items are opened', () => {
    const result = calculateScore({
      isCorrect: true,
      totalEvidenceCount: 4,
      openedEvidenceIds: ['ev_1', 'ev_2'],
      decisiveEvidenceIds: ['ev_2', 'ev_4'] // 1 out of 2 opened
    });

    expect(result.breakdown.culpritScore).toBe(70);
    expect(result.breakdown.clueScore).toBe(5); // 50% of 10
    expect(result.breakdown.evidenceScore).toBe(10); // 2/4 = 50% of 20
    expect(result.score).toBe(85);
  });
});
