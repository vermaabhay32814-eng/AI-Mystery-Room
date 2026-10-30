// client/src/components/mystery/SuspectCard.jsx
import React from 'react';
import { User, ShieldAlert, Clock, AlertCircle } from 'lucide-react';

export const SuspectCard = ({ suspect, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 ${
        isSelected
          ? 'bg-noir-850 border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/50'
          : 'bg-noir-900 border-noir-800/80 hover:border-noir-700 hover:bg-noir-850/60'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-noir-950 border border-noir-700 flex items-center justify-center text-noir-400 font-bold text-lg font-mono">
            {suspect.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-cinzel">{suspect.name}</h4>
            <span className="text-xs text-emerald-400 font-mono">
              {suspect.role} {suspect.age ? `(${suspect.age} yrs)` : ''}
            </span>
          </div>
        </div>

        <p className="text-xs text-noir-300 line-clamp-2 leading-relaxed mb-4">
          {suspect.description}
        </p>

        {/* Motive & Alibi */}
        <div className="space-y-2 text-xs">
          <div className="bg-noir-950/70 p-2.5 rounded-lg border border-noir-800/80">
            <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider block font-semibold mb-0.5">
              Claimed Alibi
            </span>
            <p className="text-noir-200 line-clamp-2">{suspect.alibi}</p>
          </div>

          <div className="bg-noir-950/70 p-2.5 rounded-lg border border-noir-800/80">
            <span className="font-mono text-[10px] text-red-400 uppercase tracking-wider block font-semibold mb-0.5">
              Possible Motive
            </span>
            <p className="text-noir-200 line-clamp-2">{suspect.motive}</p>
          </div>
        </div>
      </div>

      {/* Known Facts */}
      {suspect.knownFacts?.length > 0 && (
        <div className="pt-3 border-t border-noir-800/80 text-[11px] text-noir-400 flex items-center gap-1.5 font-mono">
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{suspect.knownFacts[0]}</span>
        </div>
      )}
    </div>
  );
};
