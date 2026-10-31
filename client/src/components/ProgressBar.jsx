/**
 * ProgressBar component
 * Props:
 *  - current: number
 *  - total: number
 *  - label: string (optional override)
 */
export default function ProgressBar({ current = 0, total = 1, label }) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0
  const displayLabel = label ?? `${current} / ${total} clues discovered`

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400 font-medium">{displayLabel}</span>
        <span className="text-xs text-amber-400 font-semibold">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
