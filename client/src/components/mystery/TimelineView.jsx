// client/src/components/mystery/TimelineView.jsx
import React from 'react';
import { Clock, MapPin, Users, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';

export const TimelineView = ({ timeline = [], suspects = [], onSelectEvidenceByEvent }) => {
  const getSuspectName = (id) => {
    const s = suspects.find((suspect) => suspect.id === id);
    return s ? s.name : id;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-white">Chronological Timeline</h3>
          <p className="text-xs text-noir-400">
            Reconstructed sequence of critical events leading up to and following the incident.
          </p>
        </div>
        <Badge variant="neutral">{timeline.length} TIMELINE CHECKPOINTS</Badge>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-noir-800 space-y-8 my-4">
        {timeline.map((event, idx) => (
          <div key={event.id || idx} className="relative group">
            {/* Timeline node dot */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-noir-950 border-2 border-emerald-500 group-hover:scale-125 transition-transform" />

            <div className="bg-noir-900 border border-noir-800/80 rounded-xl p-5 shadow-lg group-hover:border-noir-700 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {event.time}
                </span>

                {event.location && (
                  <span className="text-xs font-mono text-noir-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-purple-400" />
                    {event.location}
                  </span>
                )}
              </div>

              <h4 className="text-base font-semibold text-white tracking-wide">{event.title}</h4>
              <p className="text-xs text-noir-200 mt-2 leading-relaxed">{event.description}</p>

              {event.involvedSuspectIds?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-noir-800/80 flex items-center gap-2 flex-wrap">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px] font-mono text-noir-400">Involved:</span>
                  {event.involvedSuspectIds.map((sId) => (
                    <span
                      key={sId}
                      className="text-[11px] font-mono bg-noir-950 text-noir-300 px-2 py-0.5 rounded border border-noir-800"
                    >
                      {getSuspectName(sId)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
