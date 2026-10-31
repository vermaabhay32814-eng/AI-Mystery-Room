import { evidenceTypeColors } from '../utils/helpers'
import Button from './Button'

/**
 * ClueCard component
 * Props:
 *  - clue: { id, title, category, content, status, evidenceType }
 *  - onDiscover: (clueId) => void
 *  - isDiscovering: boolean
 */
export default function ClueCard({ clue, onDiscover, isDiscovering = false }) {
  if (!clue) return null

  const isDiscovered = clue.status === 'discovered'
  const clueId = clue.id || clue._id

  return (
    <div
      className={`mystery-card transition-all duration-300 ${
        isDiscovered
          ? 'border-slate-600 bg-slate-800'
          : 'border-slate-700/60 bg-slate-800/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`badge text-xs ${
                isDiscovered
                  ? 'bg-green-900/50 text-green-300 border border-green-700'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600'
              }`}
            >
              {isDiscovered ? '🔓 Discovered' : '🔒 Locked'}
            </span>
            {clue.category && (
              <span className="badge bg-slate-700/50 text-slate-400 border border-slate-600">
                {clue.category}
              </span>
            )}
            {isDiscovered && clue.evidenceType && (
              <span className={`badge ${evidenceTypeColors(clue.evidenceType)}`}>
                {clue.evidenceType}
              </span>
            )}
          </div>
          <h4 className="font-serif font-semibold text-slate-200 leading-tight">
            {clue.title}
          </h4>
        </div>
      </div>

      {isDiscovered ? (
        // Full content
        <p className="text-slate-300 text-sm leading-relaxed mt-2">{clue.content}</p>
      ) : (
        // Locked — show discover button
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-slate-500 text-sm italic">
            Investigate this clue to reveal its contents…
          </p>
          <Button
            variant="secondary"
            size="sm"
            loading={isDiscovering}
            disabled={isDiscovering}
            onClick={() => onDiscover && onDiscover(clueId)}
            className="shrink-0"
          >
            {isDiscovering ? 'Discovering…' : 'Discover'}
          </Button>
        </div>
      )}
    </div>
  )
}
