// client/src/components/evidence/EvidenceViewer.jsx
import React from 'react';
import { ChatTranscriptViewer } from './ChatTranscriptViewer.jsx';
import { CCTVLogViewer } from './CCTVLogViewer.jsx';
import { DocumentViewer } from './DocumentViewer.jsx';
import { WitnessStatementViewer } from './WitnessStatementViewer.jsx';
import { ForensicReportViewer } from './ForensicReportViewer.jsx';
import { Badge } from '../ui/Badge.jsx';
import { ShieldAlert, Image as ImageIcon } from 'lucide-react';

export const EvidenceViewer = ({ evidence }) => {
  if (!evidence) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-noir-400">
        <p className="text-sm">Select an evidence artifact from the dossier to inspect details.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (evidence.type) {
      case 'chat':
        return <ChatTranscriptViewer content={evidence.content} />;
      case 'cctv':
        return <CCTVLogViewer content={evidence.content} />;
      case 'document':
        return <DocumentViewer content={evidence.content} />;
      case 'witness_statement':
        return <WitnessStatementViewer content={evidence.content} />;
      case 'forensic_report':
        return <ForensicReportViewer content={evidence.content} />;
      case 'image':
      default:
        return (
          <div className="bg-noir-900 border border-noir-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <ImageIcon className="w-5 h-5" />
              <span className="font-semibold text-sm">Visual Evidence Item</span>
            </div>
            {evidence.assetUrl ? (
              <img
                src={evidence.assetUrl}
                alt={evidence.title}
                className="w-full rounded-lg max-h-80 object-cover border border-noir-700"
              />
            ) : (
              <div className="bg-noir-950 p-6 rounded-lg border border-dashed border-noir-700 text-center text-noir-400 font-mono text-xs">
                [VISUAL ARTIFACT DESCRIPTION]: {typeof evidence.content === 'string' ? evidence.content : JSON.stringify(evidence.content)}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Evidence Top Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-noir-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald">{evidence.type.toUpperCase()}</Badge>
            <span className="text-[11px] font-mono text-noir-400">ID: {evidence.id}</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">{evidence.title}</h3>
          <p className="text-xs text-noir-300 mt-0.5">{evidence.description}</p>
        </div>

        <div className="text-right text-xs font-mono text-noir-400">
          <div>Source: {evidence.source}</div>
          {evidence.timestamp && <div>Time: {evidence.timestamp}</div>}
        </div>
      </div>

      {/* Primary Artifact Rendering */}
      <div>{renderContent()}</div>

      {/* Fictional disclaimer badge */}
      <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-noir-400 border-t border-noir-800/80">
        <span className="flex items-center gap-1.5 text-amber-400/90">
          <ShieldAlert className="w-3.5 h-3.5" />
          {evidence.authenticityLabel || 'FICTIONAL CASE EVIDENCE'}
        </span>
        {evidence.linkedSuspectIds?.length > 0 && (
          <span>Linked Suspects: {evidence.linkedSuspectIds.join(', ')}</span>
        )}
      </div>
    </div>
  );
};
