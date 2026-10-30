// client/src/components/evidence/WitnessStatementViewer.jsx
import React from 'react';
import { UserCheck, Quote, ShieldAlert } from 'lucide-react';

export const WitnessStatementViewer = ({ content }) => {
  const interviewer = content?.interviewer || 'Lead Inspector';
  const interviewee = content?.interviewee || 'Witness';
  const statement = content?.statement || '';

  return (
    <div className="bg-noir-900 border border-purple-900/40 rounded-xl p-5 shadow-lg space-y-4">
      {/* Deposition Metadata */}
      <div className="flex items-center justify-between pb-3 border-b border-noir-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-300">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{interviewee}</h4>
            <span className="text-[11px] font-mono text-purple-400">Interviewer: {interviewer}</span>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase bg-purple-950/40 text-purple-300 px-2.5 py-1 rounded border border-purple-800/40">
          Witness Deposition
        </span>
      </div>

      {/* Statement quote block */}
      <div className="relative bg-noir-950/80 rounded-xl p-4 border border-noir-800">
        <Quote className="w-6 h-6 text-purple-600/30 absolute top-3 left-3 pointer-events-none" />
        <p className="text-xs text-noir-200 leading-relaxed italic pl-6 whitespace-pre-wrap">
          "{statement}"
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-noir-400 font-mono">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        <span>Compare statement against physical logs and suspect alibis for inconsistencies.</span>
      </div>
    </div>
  );
};

