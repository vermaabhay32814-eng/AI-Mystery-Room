// client/src/components/evidence/ChatTranscriptViewer.jsx
import React from 'react';
import { MessageSquare, CheckCheck, Users } from 'lucide-react';

export const ChatTranscriptViewer = ({ content }) => {
  const participants = content?.participants || [];
  const messages = content?.messages || [];
  const channel = content?.channel || 'Direct Communication';

  return (
    <div className="bg-noir-950 border border-noir-800 rounded-xl overflow-hidden flex flex-col font-sans">
      {/* Messaging Header */}
      <div className="bg-noir-900 px-4 py-3 border-b border-noir-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">{channel}</h4>
            <div className="flex items-center gap-1.5 text-[10px] text-noir-400">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>{participants.join(', ')}</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
          SECURE LOG
        </span>
      </div>

      {/* Messages stream */}
      <div className="p-4 space-y-3 min-h-[240px] max-h-[400px] overflow-y-auto bg-[radial-gradient(#1a1f2c_1px,transparent_1px)] [background-size:16px_16px]">
        {messages.map((msg, idx) => {
          const isFirstUser = participants.length > 0 && msg.sender === participants[0];

          return (
            <div
              key={idx}
              className={`flex flex-col ${isFirstUser ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[11px] font-mono font-medium text-noir-300">
                  {msg.sender}
                </span>
                <span className="text-[10px] font-mono text-noir-400">{msg.time}</span>
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-md border ${
                  isFirstUser
                    ? 'bg-noir-850 text-noir-100 border-noir-700/60 rounded-tl-sm'
                    : 'bg-emerald-950/80 text-emerald-100 border-emerald-800/40 rounded-tr-sm'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-noir-400">
                  <CheckCheck className="w-3 h-3 text-emerald-400 inline" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

