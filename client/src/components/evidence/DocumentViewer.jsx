// client/src/components/evidence/DocumentViewer.jsx
import React from 'react';
import { FileText, Stamp } from 'lucide-react';

export const DocumentViewer = ({ content }) => {
  const workstation = content?.workstation;
  const entries = content?.entries;

  return (
    <div className="bg-noir-900 border border-noir-700/60 rounded-xl p-5 shadow-inner font-sans text-xs">
      <div className="border-b border-noir-800 pb-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <span className="font-mono font-bold text-white uppercase tracking-wider text-xs">
            {workstation || 'CONFIDENTIAL RECORD'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 border border-amber-800/40 px-2 py-0.5 rounded bg-amber-950/20">
          <Stamp className="w-3 h-3" /> ARCHIVAL COPY
        </div>
      </div>

      {entries && Array.isArray(entries) ? (
        <div className="space-y-2 font-mono">
          {entries.map((item, idx) => (
            <div key={idx} className="bg-noir-950/80 p-2.5 rounded border border-noir-800 flex items-start gap-3">
              <span className="text-amber-400/90 font-bold whitespace-nowrap text-[11px]">
                {item.timestamp || `00:${idx}`}
              </span>
              <span className="text-noir-200">{item.action || item.description || JSON.stringify(item)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-noir-950/80 p-4 rounded border border-noir-800 font-mono text-noir-300 leading-relaxed whitespace-pre-wrap">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </div>
      )}
    </div>
  );
};

