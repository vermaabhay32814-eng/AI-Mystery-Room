/**
 * SuspectCard component
 * Props:
 *  - suspect: { id, name, role, profile, alibi }
 *  - isSelected: boolean
 *  - onSelect: (suspectId) => void
 *  - selectable: boolean — shows click-to-select behavior
 */
export default function SuspectCard({ suspect, isSelected = false, onSelect, selectable = false }) {
  if (!suspect) return null

  const handleClick = () => {
    if (selectable && onSelect) onSelect(suspect.id || suspect._id)
  }

  return (
    <div
      onClick={handleClick}
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
      onKeyDown={selectable ? (e) => e.key === 'Enter' && handleClick() : undefined}
      className={`
        mystery-card relative transition-all duration-200
        ${selectable ? 'cursor-pointer' : ''}
        ${isSelected
          ? 'border-amber-500 bg-amber-950/30 ring-2 ring-amber-500/50'
          : selectable
            ? 'hover:border-amber-600/50 hover:bg-slate-750'
            : 'hover:border-slate-600'
        }
      `}
    >
      {/* Selection indicator */}
      {selectable && (
        <div className="absolute top-4 right-4">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-600'
            }`}
          >
            {isSelected && (
              <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Avatar placeholder */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-2xl">
          🧑
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h3 className="font-serif font-semibold text-slate-100 text-lg leading-tight">
            {suspect.name}
          </h3>
          <p className="text-amber-400 text-sm font-medium mb-2">{suspect.role}</p>
        </div>
      </div>

      {/* Profile */}
      {suspect.profile && (
        <div className="mt-3">
          <p className="text-xs text-slate-500 uppercase font-medium tracking-wide mb-1">Profile</p>
          <p className="text-slate-300 text-sm leading-relaxed">{suspect.profile}</p>
        </div>
      )}

      {/* Alibi */}
      {suspect.alibi && (
        <div className="mt-3 bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase font-medium tracking-wide mb-1">
            🗣 Alibi
          </p>
          <p className="text-slate-300 text-sm leading-relaxed italic">"{suspect.alibi}"</p>
        </div>
      )}

      {isSelected && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <span>✓</span> Selected as your suspect
          </span>
        </div>
      )}
    </div>
  )
}
