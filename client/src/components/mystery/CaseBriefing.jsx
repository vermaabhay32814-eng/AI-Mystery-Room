// client/src/components/mystery/CaseBriefing.jsx
import React from 'react';
import { ShieldAlert, MapPin, Wind, Eye, Users, FileSearch } from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';

export const CaseBriefing = ({ caseData }) => {
  const publicCase = caseData?.publicCase || {};
  const setting = publicCase?.setting || {};

  return (
    <div className="space-y-6">
      {/* Title & Metadata */}
      <div className="bg-noir-900 border border-noir-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="emerald">ACTIVE INVESTIGATION</Badge>
          <Badge variant="amber">DIFFICULTY: {caseData?.difficulty?.toUpperCase()}</Badge>
          <Badge variant="neutral">GENRE: {caseData?.genre?.toUpperCase()}</Badge>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white tracking-wide">
          {caseData?.title}
        </h2>
        <p className="text-sm text-noir-300 mt-2 leading-relaxed max-w-3xl">
          {publicCase?.synopsis}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-noir-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-bold text-white font-mono">
                {publicCase?.suspects?.length || 0}
              </div>
              <div className="text-[11px] text-noir-400 uppercase font-mono">Suspects</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
              <FileSearch className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-bold text-white font-mono">
                {publicCase?.evidence?.length || 0}
              </div>
              <div className="text-[11px] text-noir-400 uppercase font-mono">Evidence Items</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                {setting?.location || 'Unspecified'}
              </div>
              <div className="text-[11px] text-noir-400 uppercase font-mono">Location</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                {setting?.atmosphere || 'Tense'}
              </div>
              <div className="text-[11px] text-noir-400 uppercase font-mono">Atmosphere</div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Report */}
      <div className="bg-noir-900 border border-noir-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-semibold text-base tracking-wide text-white font-cinzel">
            Initial Crime Scene Dispatch
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-noir-200 leading-relaxed whitespace-pre-wrap">
          {publicCase?.incident}
        </p>
      </div>

      {/* Investigation Instructions & Fictional Disclaimer */}
      <div className="bg-noir-950/80 border border-noir-800/80 rounded-xl p-4 flex items-start gap-3 text-xs text-noir-400">
        <Eye className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-noir-200">Investigator Protocol:</span> Examine every suspect's dossier and interrogate the digital evidence files. Compare claimed alibis with timestamps and logs to uncover the contradiction. When your theory is proven, submit your accusation.
        </div>
      </div>
    </div>
  );
};

