// client/src/components/evidence/CCTVLogViewer.jsx
import React from 'react';
import { Video, AlertTriangle, Clock } from 'lucide-react';

export const CCTVLogViewer = ({ content }) => {
  const camera = content?.camera || 'CAM-PRIMARY';
  const period = content?.period || 'N/A';
  const entries = content?.entries || [];

  return (
    <div className="bg-black border border-noir-800 rounded-xl overflow-hidden font-mono text-xs">
      {/* CCTV HUD Header */}
      <div className="bg-noir-900/90 px-4 py-2.5 border-b border-noir-800 flex items-center justify-between text-noir-300">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
            <Video className="w-4 h-4 text-red-500" /> {camera}
          </span>
        </div>
        <div className="flex items-center gap-2 text-noir-400 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>WINDOW: {period}</span>
        </div>
      </div>

      {/* Visual Camera Scanlines Simulation */}
      <div className="relative p-4 bg-noir-950/90 text-cyan-300/90 space-y-2.5 max-h-[350px] overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

        {entries.map((entry, idx) => {
          const isWarning = entry.event?.toLowerCase().includes('dropout') || entry.event?.toLowerCase().includes('fluctuation') || entry.event?.toLowerCase().includes('shadow');

          return (
            <div
              key={idx}
              className={`p-2.5 rounded border flex items-start gap-3 transition-colors ${
                isWarning
                  ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                  : 'bg-noir-900/40 border-noir-800/60 text-noir-200'
              }`}
            >
              <span className="text-cyan-400 font-bold whitespace-nowrap text-[11px] bg-noir-900 px-1.5 py-0.5 rounded border border-noir-700/50">
                [{entry.time}]
              </span>
              <div className="flex-1">
                {isWarning && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold mr-2 uppercase">
                    <AlertTriangle className="w-3 h-3 inline" /> ANOMALY:
                  </span>
                )}
                <span>{entry.event}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

