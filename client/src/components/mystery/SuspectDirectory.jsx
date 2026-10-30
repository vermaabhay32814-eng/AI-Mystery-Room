// client/src/components/mystery/SuspectDirectory.jsx
import React from 'react';
import { SuspectCard } from './SuspectCard.jsx';
import { Badge } from '../ui/Badge.jsx';
import { UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SuspectDirectory = ({ suspects = [], selectedSuspectId, onSelectSuspect, onAccuse }) => {
  const selectedSuspect = suspects.find((s) => s.id === selectedSuspectId) || suspects[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-white">Suspect Roster</h3>
          <p className="text-xs text-noir-400">
            Select a person of interest to review their background and interrogation notes.
          </p>
        </div>
        <Badge variant="neutral">{suspects.length} PERSONS OF INTEREST</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suspects.map((suspect) => (
          <SuspectCard
            key={suspect.id}
            suspect={suspect}
            isSelected={selectedSuspect?.id === suspect.id}
            onSelect={() => onSelectSuspect(suspect.id)}
          />
        ))}
      </div>

      {/* Selected Suspect Detailed Dossier */}
      {selectedSuspect && (
        <div className="bg-noir-900 border border-noir-700/80 rounded-2xl p-6 shadow-2xl mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-noir-800">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                Detailed Suspect Dossier
              </span>
              <h3 className="text-2xl font-bold text-white font-cinzel">{selectedSuspect.name}</h3>
              <p className="text-xs text-noir-400 font-mono mt-0.5">
                {selectedSuspect.role} {selectedSuspect.age ? `• ${selectedSuspect.age} years old` : ''}
              </p>
            </div>

            <button
              onClick={() => onAccuse(selectedSuspect.id)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-700/90 text-white font-semibold text-xs tracking-wider uppercase hover:bg-red-600 transition shadow-lg shadow-red-950/50 border border-red-500/30"
            >
              <ShieldAlert className="w-4 h-4" />
              Accuse {selectedSuspect.name}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <div className="bg-noir-950 p-4 rounded-xl border border-noir-800">
                <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider font-semibold block mb-1">
                  Full Claimed Alibi
                </span>
                <p className="text-noir-200 leading-relaxed">{selectedSuspect.alibi}</p>
              </div>

              <div className="bg-noir-950 p-4 rounded-xl border border-noir-800">
                <span className="font-mono text-[10px] text-red-400 uppercase tracking-wider font-semibold block mb-1">
                  Primary Motive Under Scrutiny
                </span>
                <p className="text-noir-200 leading-relaxed">{selectedSuspect.motive}</p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedSuspect.personality && (
                <div className="bg-noir-950 p-4 rounded-xl border border-noir-800">
                  <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wider font-semibold block mb-1">
                    Behavioral Profile & Demeanor
                  </span>
                  <p className="text-noir-200 leading-relaxed">{selectedSuspect.personality}</p>
                </div>
              )}

              {selectedSuspect.knownFacts?.length > 0 && (
                <div className="bg-noir-950 p-4 rounded-xl border border-noir-800">
                  <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-semibold block mb-1">
                    Known Facts & Discovered Details
                  </span>
                  <ul className="space-y-1.5 list-disc list-inside text-noir-200">
                    {selectedSuspect.knownFacts.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
