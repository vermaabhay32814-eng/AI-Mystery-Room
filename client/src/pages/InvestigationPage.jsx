// client/src/pages/InvestigationPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  Clock,
  Notebook,
  ShieldAlert,
  Search,
  CheckCircle2,
  FolderOpen,
  ArrowLeft,
  Award
} from 'lucide-react';
import { InvestigationProvider, useInvestigation } from '../context/InvestigationContext.jsx';
import { CaseBriefing } from '../components/mystery/CaseBriefing.jsx';
import { SuspectDirectory } from '../components/mystery/SuspectDirectory.jsx';
import { TimelineView } from '../components/mystery/TimelineView.jsx';
import { InvestigatorNotes } from '../components/mystery/InvestigatorNotes.jsx';
import { EvidenceCard } from '../components/evidence/EvidenceCard.jsx';
import { EvidenceViewer } from '../components/evidence/EvidenceViewer.jsx';
import { AccusationModal } from '../components/mystery/AccusationModal.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton.jsx';

const InvestigationContent = () => {
  const {
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
    isCompleted
  } = useInvestigation();

  const [isAccusationOpen, setIsAccusationOpen] = useState(false);
  const [evidenceFilter, setEvidenceFilter] = useState('all');
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <LoadingSkeleton className="h-20" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton className="h-96" />
          <LoadingSkeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-noir-900 border border-noir-800 rounded-3xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-xl font-bold font-cinzel text-white">Investigation Inaccessible</h3>
        <p className="text-xs text-noir-300">{error || 'Case file not found or unauthorized'}</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const publicCase = caseData.publicCase || {};
  const evidenceList = publicCase.evidence || [];
  const suspects = publicCase.suspects || [];
  const timeline = publicCase.timeline || [];

  const filteredEvidence =
    evidenceFilter === 'all'
      ? evidenceList
      : evidenceList.filter((e) => e.type === evidenceFilter);

  const activeEvidence = evidenceList.find((e) => e.id === selectedEvidenceId) || evidenceList[0];

  const handleSelectEvidence = (id) => {
    setSelectedEvidenceId(id);
    markEvidenceOpened(id);
  };

  const handleOpenAccusation = (suspectId = null) => {
    if (suspectId) {
      setSelectedSuspectId(suspectId);
    }
    setIsAccusationOpen(true);
  };

  const handleAccusationSubmitted = async (suspectId) => {
    await submitAccusation(suspectId);
    navigate(`/reveal/${caseData._id}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-noir-950">
      {/* Top Bar Navigation */}
      <div className="border-b border-noir-800/80 bg-noir-950/90 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-lg text-noir-400 hover:text-white hover:bg-noir-800 transition"
            title="Back to Cases"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold font-cinzel text-white line-clamp-1">
              {caseData.title}
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-mono text-noir-400">
              <span>CASE ID: {caseData._id}</span>
              <span>•</span>
              <span className="text-emerald-400">
                {openedEvidenceIds.length} / {evidenceList.length} Clues Examined
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/reveal/${caseData._id}`)}
              className="border-emerald-500/40 text-emerald-400"
            >
              <Award className="w-4 h-4 mr-1.5" />
              View Solution Reveal
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleOpenAccusation()}
              className="shadow-lg shadow-red-950/40"
            >
              <ShieldAlert className="w-4 h-4 mr-1.5" />
              Accuse Suspect
            </Button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Tabs (Col 1-3) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-noir-900 border border-noir-800 rounded-2xl p-3 space-y-1">
            <button
              onClick={() => setActiveTab('briefing')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'briefing'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                  : 'text-noir-300 hover:bg-noir-850 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Case Briefing</span>
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'evidence'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                  : 'text-noir-300 hover:bg-noir-850 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderOpen className="w-4 h-4" />
                <span>Evidence Dossier</span>
              </div>
              <span className="text-[10px] font-mono bg-noir-950 px-1.5 py-0.5 rounded border border-noir-800">
                {evidenceList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('suspects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'suspects'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                  : 'text-noir-300 hover:bg-noir-850 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Suspect Roster</span>
              </div>
              <span className="text-[10px] font-mono bg-noir-950 px-1.5 py-0.5 rounded border border-noir-800">
                {suspects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'timeline'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                  : 'text-noir-300 hover:bg-noir-850 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>Incident Timeline</span>
              </div>
              <span className="text-[10px] font-mono bg-noir-950 px-1.5 py-0.5 rounded border border-noir-800">
                {timeline.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'notes'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                  : 'text-noir-300 hover:bg-noir-850 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Notebook className="w-4 h-4" />
                <span>Detective Notebook</span>
              </div>
              <span className="text-[10px] font-mono bg-noir-950 px-1.5 py-0.5 rounded border border-noir-800">
                {notes.length}
              </span>
            </button>
          </div>

          {/* Quick Evidence Quicklist when looking at other tabs */}
          {activeTab !== 'evidence' && (
            <div className="bg-noir-900 border border-noir-800 rounded-2xl p-4 space-y-3">
              <span className="text-[11px] font-mono text-noir-400 uppercase tracking-wider block font-semibold">
                Quick Clue Checklist
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {evidenceList.map((ev) => {
                  const isOpened = openedEvidenceIds.includes(ev.id);
                  return (
                    <div
                      key={ev.id}
                      onClick={() => {
                        setSelectedEvidenceId(ev.id);
                        markEvidenceOpened(ev.id);
                        setActiveTab('evidence');
                      }}
                      className="p-2 rounded-lg bg-noir-950 border border-noir-800/80 text-[11px] cursor-pointer hover:border-noir-700 flex items-center justify-between"
                    >
                      <span className="truncate text-noir-300 max-w-[160px]">{ev.title}</span>
                      {isOpened && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Center/Right Investigation Stage (Col 4-12) */}
        <main className="lg:col-span-9">
          {activeTab === 'briefing' && <CaseBriefing caseData={caseData} />}

          {activeTab === 'suspects' && (
            <SuspectDirectory
              suspects={suspects}
              selectedSuspectId={selectedSuspectId}
              onSelectSuspect={setSelectedSuspectId}
              onAccuse={(sId) => handleOpenAccusation(sId)}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView
              timeline={timeline}
              suspects={suspects}
              onSelectEvidenceByEvent={(eId) => {
                setSelectedEvidenceId(eId);
                setActiveTab('evidence');
              }}
            />
          )}

          {activeTab === 'notes' && (
            <InvestigatorNotes notes={notes} onSaveNote={saveNote} onDeleteNote={deleteNote} />
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-6">
              {/* Evidence Type Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
                {['all', 'chat', 'cctv', 'document', 'witness_statement', 'forensic_report'].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setEvidenceFilter(type)}
                      className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap uppercase ${
                        evidenceFilter === type
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60 font-semibold'
                          : 'bg-noir-900 text-noir-400 border-noir-800 hover:text-white'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>

              {/* Two column evidence layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Evidence Item List (5 cols) */}
                <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
                  {filteredEvidence.map((ev) => (
                    <EvidenceCard
                      key={ev.id}
                      evidence={ev}
                      isOpened={openedEvidenceIds.includes(ev.id)}
                      isSelected={activeEvidence?.id === ev.id}
                      onClick={() => handleSelectEvidence(ev.id)}
                    />
                  ))}
                </div>

                {/* Selected Evidence Detail Viewer (7 cols) */}
                <div className="lg:col-span-7 bg-noir-900 border border-noir-800 rounded-2xl p-6 shadow-2xl">
                  <EvidenceViewer evidence={activeEvidence} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Culprit Accusation Modal */}
      <AccusationModal
        isOpen={isAccusationOpen}
        onClose={() => setIsAccusationOpen(false)}
        suspects={suspects}
        initialSuspectId={selectedSuspectId}
        onSubmitAccusation={handleAccusationSubmitted}
      />
    </div>
  );
};

export const InvestigationPage = () => {
  const { caseId } = useParams();
  return (
    <InvestigationProvider caseId={caseId}>
      <InvestigationContent />
    </InvestigationProvider>
  );
};
