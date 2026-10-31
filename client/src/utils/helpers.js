/**
 * Format a difficulty level string for display.
 */
export function formatDifficulty(difficulty) {
  if (!difficulty) return 'Unknown'
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
}

/**
 * Returns Tailwind color classes for difficulty badges.
 */
export function difficultyColors(difficulty) {
  switch ((difficulty || '').toLowerCase()) {
    case 'easy':
      return 'bg-green-900/50 text-green-300 border border-green-700'
    case 'medium':
      return 'bg-amber-900/50 text-amber-300 border border-amber-700'
    case 'hard':
      return 'bg-red-900/50 text-red-300 border border-red-700'
    default:
      return 'bg-slate-700 text-slate-300 border border-slate-600'
  }
}

/**
 * Returns Tailwind color classes for evidence type badges.
 */
export function evidenceTypeColors(type) {
  switch ((type || '').toLowerCase()) {
    case 'physical':
      return 'bg-blue-900/50 text-blue-300 border border-blue-700'
    case 'testimonial':
      return 'bg-purple-900/50 text-purple-300 border border-purple-700'
    case 'documentary':
      return 'bg-teal-900/50 text-teal-300 border border-teal-700'
    case 'digital':
      return 'bg-cyan-900/50 text-cyan-300 border border-cyan-700'
    case 'circumstantial':
      return 'bg-orange-900/50 text-orange-300 border border-orange-700'
    default:
      return 'bg-slate-700/50 text-slate-300 border border-slate-600'
  }
}

/**
 * Count discovered clues from a clues array.
 */
export function countDiscoveredClues(clues = []) {
  return clues.filter((c) => c.status === 'discovered').length
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text, maxLength = 120) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

/**
 * Compute total score from result data.
 */
export function computeScore(result) {
  const base = result?.score?.base ?? 0
  const clueBonus = result?.score?.clueBonus ?? 0
  const hintPenalty = result?.score?.hintPenalty ?? 0
  return base + clueBonus - hintPenalty
}
