import Button from './Button'

/**
 * HintPanel component
 * Props:
 *  - revealedHints: string[]
 *  - hintsUsed: number
 *  - hintsRemaining: number
 *  - onRequestHint: () => void
 *  - isLoading: boolean
 *  - error: string | null
 */
export default function HintPanel({
  revealedHints = [],
  hintsUsed = 0,
  hintsRemaining = 0,
  onRequestHint,
  isLoading = false,
  error = null,
}) {
  const totalHints = hintsUsed + hintsRemaining

  return (
    <div className="mystery-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-semibold text-slate-100 text-lg flex items-center gap-2">
          <span>💡</span> Hints
        </h3>
        <span className="text-xs text-slate-400">
          {hintsUsed}/{totalHints} used
          {hintsRemaining > 0 && (
            <span className="ml-1 text-amber-400">(-10 pts each)</span>
          )}
        </span>
      </div>

      {/* Hint dots */}
      <div className="flex gap-1.5 mb-4">
        {Array.from({ length: totalHints }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < hintsUsed ? 'bg-amber-500' : 'bg-slate-700 border border-slate-600'
            }`}
          />
        ))}
      </div>

      {/* Revealed hints list */}
      {revealedHints.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {revealedHints.map((hint, idx) => (
            <li
              key={idx}
              className="flex gap-3 bg-amber-950/20 border border-amber-800/30 rounded-lg p-3"
            >
              <span className="text-amber-500 shrink-0 text-sm font-bold">#{idx + 1}</span>
              <p className="text-sm text-slate-300 leading-relaxed">{hint}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 text-sm mb-4 italic">No hints revealed yet.</p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-400 text-sm mb-3 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Request hint button */}
      <Button
        variant="secondary"
        size="sm"
        loading={isLoading}
        disabled={hintsRemaining === 0 || isLoading}
        onClick={onRequestHint}
        className="w-full border-amber-700/50 text-amber-400 hover:bg-amber-900/20"
      >
        {hintsRemaining === 0
          ? 'No hints remaining'
          : isLoading
            ? 'Getting hint…'
            : `Request Hint (${hintsRemaining} left)`}
      </Button>
    </div>
  )
}
