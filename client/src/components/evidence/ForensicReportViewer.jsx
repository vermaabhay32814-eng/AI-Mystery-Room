// client/src/components/evidence/ForensicReportViewer.jsx
import React from 'react';
import { Activity, Microscope, Fingerprint } from 'lucide-react';

export const ForensicReportViewer = ({ content }) => {
  const caseRef = content?.caseReference || 'FOR-LAB-01';
  const findings = content?.findings || [];

  return (
    <div className="bg-noir-900 border border-red-900/40 rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-700/50 flex items-center justify-center text-red-300">
            <Microscope className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Forensic Analysis Brief</h4>
            <span className="text-[11px] font-mono text-red-400">Ref: {caseRef}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase bg-red-950/40 text-red-300 px-2.5 py-1 rounded border border-red-800/40">
          <Fingerprint className="w-3.5 h-3.5" /> Fictional Crime Lab
        </div>
      </div>

      {/* Findings items */}
      <div className="space-y-2.5">
        <span className="text-xs font-mono text-noir-400 uppercase tracking-wider block">
          Key Laboratory Observations:
        </span>
        {findings.map((finding, idx) => (
          <div
            key={idx}
            className="bg-noir-950/90 border border-noir-800 rounded-lg p-3 flex items-start gap-3"
          >
            <div className="w-5 h-5 rounded bg-red-950 border border-red-800/40 text-red-400 flex items-center justify-center font-mono text-[10px] font-bold mt-0.5">
              {idx + 1}
            </div>
            <p className="text-xs text-noir-200 leading-relaxed font-sans">{finding}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

