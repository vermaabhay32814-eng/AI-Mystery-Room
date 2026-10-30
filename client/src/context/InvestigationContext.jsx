// client/src/context/InvestigationContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { caseService } from '../services/case.service.js';
import { investigationService } from '../services/investigation.service.js';

const InvestigationContext = createContext(null);

export const InvestigationProvider = ({ caseId, children }) => {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('briefing'); // 'briefing', 'suspects', 'evidence', 'timeline', 'notes'
  const [selectedEvidenceId, setSelectedEvidenceId] = useState(null);
  const [selectedSuspectId, setSelectedSuspectId] = useState(null);

  const [openedEvidenceIds, setOpenedEvidenceIds] = useState([]);
  const [notes, setNotes] = useState([]);
  const [investigationResult, setInvestigationResult] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load case and progress
  const loadCase = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [caseRes, progressRes] = await Promise.all([
        caseService.getCaseById(caseId),
        investigationService.getProgress(caseId).catch(() => ({ success: false }))
      ]);

      if (caseRes.success && caseRes.data?.case) {
        setCaseData(caseRes.data.case);
      }

      if (progressRes.success && progressRes.data?.progress) {
        const prog = progressRes.data.progress;
        setOpenedEvidenceIds(prog.openedEvidenceIds || []);
        setNotes(prog.notes || []);
        if (prog.status === 'completed' && prog.result) {
          setIsCompleted(true);
          setInvestigationResult(prog.result);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load case');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    if (caseId) {
      loadCase();
    }
  }, [caseId, loadCase]);

  // Mark an evidence item as opened and sync with backend
  const markEvidenceOpened = async (evidenceId) => {
    if (!evidenceId) return;
    if (!openedEvidenceIds.includes(evidenceId)) {
      const updated = [...openedEvidenceIds, evidenceId];
      setOpenedEvidenceIds(updated);
      try {
        await investigationService.updateProgress(caseId, { openedEvidenceId: evidenceId });
      } catch (err) {
        console.error('Failed to sync opened evidence:', err);
      }
    }
  };

  // Add or update detective note
  const saveNote = async (content) => {
    const newNote = {
      id: `note_${Date.now()}`,
      content,
      createdAt: new Date().toISOString()
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);

    try {
      await investigationService.updateProgress(caseId, { notes: updatedNotes });
    } catch (err) {
      console.error('Failed to sync note:', err);
    }
  };

  const deleteNote = async (noteId) => {
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);
    try {
      await investigationService.updateProgress(caseId, { notes: updatedNotes });
    } catch (err) {
      console.error('Failed to sync deleted note:', err);
    }
  };

  // Submit final culprit accusation
  const submitAccusation = async (suspectId) => {
    try {
      const res = await investigationService.submitAccusation(caseId, suspectId);
      if (res.success) {
        setIsCompleted(true);
        setInvestigationResult(res.data.result);
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <InvestigationContext.Provider
      value={{
        caseData,
        loading,
        error,
        activeTab,
        setActiveTab,
        selectedEvidenceId,
        setSelectedEvidenceId,
        selectedSuspectId,
        setSelectedSuspectId,
        openedEvidenceIds,
        markEvidenceOpened,
        notes,
        saveNote,
        deleteNote,
        submitAccusation,
        investigationResult,
        isCompleted,
        reloadCase: loadCase
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
