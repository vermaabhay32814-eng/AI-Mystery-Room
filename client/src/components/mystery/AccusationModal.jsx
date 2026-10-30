// client/src/components/mystery/AccusationModal.jsx
import React, { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AccusationModal = ({
  isOpen,
  onClose,
  suspects = [],
  initialSuspectId = null,
  onSubmitAccusation
}) => {
  const [selectedId, setSelectedId] = useState(initialSuspectId || suspects[0]?.id || '');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const selectedSuspect = suspects.find((s) => s.id === selectedId);

  const handleSubmit = async () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmitAccusation(selectedId);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit accusation');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FINAL ACCUSATION HEARING">
      <div className="space-y-5">
        <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-red-200 leading-relaxed">
            <span className="font-bold text-white uppercase block mb-0.5">Warning: Final Case Accusation</span>
            Once you submit your formal charge, the case file will close permanently. The true culprit, decisive clues, and your detective score will be revealed immediately.
          </div>
        </div>

        {/* Suspect Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-noir-400 uppercase tracking-wider block">
            Select Prime Perpetrator:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suspects.map((suspect) => {
              const isChecked = selectedId === suspect.id;
              return (
                <div
                  key={suspect.id}
                  onClick={() => setSelectedId(suspect.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    isChecked
                      ? 'bg-red-950/50 border-red-500 text-white'
                      : 'bg-noir-950 border-noir-800 text-noir-300 hover:border-noir-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs">{suspect.name}</div>
                    <div className="text-[10px] text-noir-400 font-mono">{suspect.role}</div>
                  </div>
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-red-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="pt-2">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-noir-950 border border-noir-800 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 bg-noir-900 border-noir-700 focus:ring-red-500"
            />
            <span className="text-xs text-noir-300 select-none">
              I am confident in my deduction based on discovered physical evidence and timeline contradictions.
            </span>
          </label>
        </div>

        {error && (
          <div className="text-xs font-mono text-red-400 bg-red-950/40 p-2.5 rounded border border-red-800/40">
            {error}
          </div>
        )}

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-noir-800">
          <Button variant="ghost" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            disabled={!selectedId || !confirmed || isSubmitting}
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Submit Formal Accusation
          </Button>
        </div>
      </div>
    </Modal>
  );
};

