// client/src/components/evidence/EvidenceCard.jsx
import React from 'react';
import { MessageSquare, Video, FileText, UserCheck, Activity, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';

export const EvidenceCard = ({ evidence, isOpened, isSelected, onClick }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'cctv':
        return <Video className="w-4 h-4 text-cyan-400" />;
      case 'document':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'witness_statement':
        return <UserCheck className="w-4 h-4 text-purple-400" />;
      case 'forensic_report':
        return <Activity className="w-4 h-4 text-red-400" />;
      case 'image':
      default:
        return <ImageIcon className="w-4 h-4 text-blue-400" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'chat':
        return 'emerald';
      case 'cctv':
        return 'blue';
      case 'document':
        return 'amber';
      case 'witness_statement':
        return 'purple';
      case 'forensic_report':
        return 'red';
      default:
        return 'neutral';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
        isSelected
          ? 'bg-noir-850 border-emerald-500 shadow-lg shadow-emerald-950/30'
          : 'bg-noir-900/90 border-noir-800 hover:border-noir-700 hover:bg-noir-850/80'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant={getBadgeVariant(evidence.type)}>
            {getIcon(evidence.type)}
            <span>{evidence.type.replace('_', ' ').toUpperCase()}</span>
          </Badge>
          {isOpened ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Examined
            </span>
          ) : (
            <span className="text-[11px] text-amber-400 font-mono font-medium">Unopened</span>
          )}
        </div>

        <h4 className="text-sm font-semibold text-white tracking-wide line-clamp-1">{evidence.title}</h4>
        <p className="text-xs text-noir-300 mt-1 line-clamp-2">{evidence.description}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-noir-800/80 text-[11px] font-mono text-noir-400">
        <span>{evidence.source}</span>
        {evidence.timestamp && <span>{evidence.timestamp}</span>}
      </div>
    </div>
  );
};
