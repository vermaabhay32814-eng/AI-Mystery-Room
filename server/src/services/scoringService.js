'use strict';

const { DIFFICULTY_CONFIG } = require('./mysteryValidator');

/**
 * Calculate the score for a completed case.
 *
 * Formula:
 *   basePoints  = correctAccusation ? difficultyBasePoints : 0
 *   cluePoints  = uniqueDiscoveredClueCount * 5
 *   hintPenalty = hintsUsed * 10
 *   total       = max(0, basePoints + cluePoints - hintPenalty)
 *
 * @param {object} params
 * @param {boolean} params.correctAccusation
 * @param {string}  params.difficulty
 * @param {string[]} params.discoveredClueIds
 * @param {number}  params.hintsUsed
 * @returns {{ basePoints: number, cluePoints: number, hintPenalty: number, total: number }}
 */
function calculateScore({ correctAccusation, difficulty, discoveredClueIds, hintsUsed }) {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  if (!cfg) throw new Error(`Unknown difficulty: ${difficulty}`);

  const basePoints = correctAccusation ? cfg.basePoints : 0;
  const uniqueDiscovered = new Set(discoveredClueIds || []);
  const cluePoints = uniqueDiscovered.size * 5;
  const hintPenalty = (hintsUsed || 0) * 10;
  const total = Math.max(0, basePoints + cluePoints - hintPenalty);

  return { basePoints, cluePoints, hintPenalty, total };
}

module.exports = { calculateScore };
