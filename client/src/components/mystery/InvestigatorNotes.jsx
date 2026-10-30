// client/src/components/mystery/InvestigatorNotes.jsx
import React, { useState } from 'react';
import { Notebook, Plus, Trash2, Save, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export const InvestigatorNotes = ({ notes = [], onSaveNote, onDeleteNote }) => {
  const [newContent, setNewContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsSaving(true);
    try {
      await onSaveNote(newContent.trim());
      setNewContent('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-white">Investigator's Field Notebook</h3>
          <p className="text-xs text-noir-400">
            Jot down contradictions, suspect theories, and cross-examined alibis. Notes are saved automatically to your case file.
          </p>
        </div>
      </div>

      {/* Note input box */}
      <form onSubmit={handleAddNote} className="bg-noir-900 border border-noir-800 rounded-2xl p-4 shadow-xl space-y-3">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Record a lead or suspicious contradiction (e.g. 'Vance claims he was in basement at 22:00, but camera log shows motion at vent...')"
          rows={3}
          className="w-full bg-noir-950 border border-noir-800 rounded-xl p-3 text-xs sm:text-sm text-noir-100 placeholder-noir-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none font-sans"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-noir-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Private Detective Log
          </span>
          <Button type="submit" size="sm" variant="primary" disabled={!newContent.trim() || isSaving} isLoading={isSaving}>
            <Plus className="w-4 h-4 mr-1" /> Add Entry
          </Button>
        </div>
      </form>

      {/* Notes listing */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="bg-noir-900/60 border border-dashed border-noir-800 rounded-2xl p-8 text-center text-noir-400">
            <Notebook className="w-8 h-8 mx-auto mb-2 text-noir-400" />
            <p className="text-xs">No case notes recorded yet. Write down leads as you inspect evidence!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-noir-900 border border-noir-800/80 rounded-xl p-4 flex items-start justify-between gap-4 shadow-md group hover:border-noir-700 transition"
            >
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-noir-200 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
                <span className="text-[10px] font-mono text-noir-400 block">
                  Logged: {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="opacity-40 group-hover:opacity-100 p-1.5 text-noir-400 hover:text-red-400 rounded-lg hover:bg-noir-800 transition"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
