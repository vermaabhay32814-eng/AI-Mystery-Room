// server/src/services/scoring.service.js

/**
 * Calculates the final score for an investigation.
 * Formula defined in SPEC.md Section 9.3:
 * - Correct culprit: 70 points
 * - Evidence investigation: up to 20 points based on proportion of evidence explored
 * - Decisive clue discovery: up to 10 points based on whether decisive evidence items were opened
 *
 * @param {Object} params
 * @param {boolean} params.isCorrect - Whether the accused suspect is the true culprit
 * @param {number} params.totalEvidenceCount - Total number of evidence artifacts in the case
 * @param {string[]} params.openedEvidenceIds - Evidence IDs discovered/opened by player
 * @param {string[]} params.decisiveEvidenceIds - Secret list of decisive evidence IDs
 * @returns {{ score: number, breakdown: { culpritScore: number, evidenceScore: number, clueScore: number } }}
 */
export const calculateScore = ({
  isCorrect,
  totalEvidenceCount,
  openedEvidenceIds = [],
  decisiveEvidenceIds = []
}) => {
  // 1. Culprit Score: 70 points for identifying the true culprit, 0 for wrong suspect
  const culpritScore = isCorrect ? 70 : 0;

  // 2. Evidence Investigation Score: Up to 20 points
  const openedSet = new Set(openedEvidenceIds);
  const evidenceRatio = totalEvidenceCount > 0 ? Math.min(1, openedSet.size / totalEvidenceCount) : 0;
  const evidenceScore = Math.round(evidenceRatio * 20);

  // 3. Decisive Clues Score: Up to 10 points
  let decisiveOpenedCount = 0;
  for (const decisiveId of decisiveEvidenceIds) {
    if (openedSet.has(decisiveId)) {
      decisiveOpenedCount++;
    }
  }
  const clueRatio = decisiveEvidenceIds.length > 0 ? decisiveOpenedCount / decisiveEvidenceIds.length : 1;
  const clueScore = Math.round(clueRatio * 10);

  const totalScore = culpritScore + evidenceScore + clueScore;

  return {
    score: totalScore,
    breakdown: {
      culpritScore,
      evidenceScore,
      clueScore
    }
  };
};

