// client/src/pages/CaseRevealPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Compass,
  FileCheck,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { investigationService } from '../services/investigation.service.js';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton.jsx';

export const CaseRevealPage = () => {
  const { caseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await investigationService.getResult(caseId);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          throw new Error('Case solution data not unlocked');
        }
      } catch (err) {
        setError(err.message || 'Cannot reveal solution until accusation is submitted.');
      } finally {
        setLoading(false);
      }
    };

    if (caseId) {
      fetchResult();
    }
  }, [caseId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <LoadingSkeleton className="h-32" />
        <LoadingSkeleton className="h-64" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-noir-900 border border-noir-800 rounded-3xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-xl font-bold font-cinzel text-white">Solution Locked</h3>
        <p className="text-xs text-noir-300">
          {error || 'You must submit a formal suspect accusation before the solution can be revealed.'}
        </p>
        <Button variant="primary" onClick={() => navigate(`/investigation/${caseId}`)}>
          Return to Active Investigation
        </Button>
      </div>
    );
  }

  const { result, selectedSuspect, realCulprit, solution } = data;
  const isCorrect = result?.isCorrect;
  const score = result?.score || 0;
  const breakdown = result?.breakdown || { culpritScore: 0, evidenceScore: 0, clueScore: 0 };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Hero Outcome Header */}
      <div
        className={`p-8 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden text-center space-y-4 ${
          isCorrect
            ? 'bg-emerald-950/40 border-emerald-500/50 shadow-emerald-950/50'
            : 'bg-red-950/40 border-red-500/50 shadow-red-950/50'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-noir-950/80 border border-white/10">
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">CASE SOLVED • ACCUSATION VERIFIED</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-300">CASE FAILED • INCORRECT SUSPECT CHARGED</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-cinzel text-white">
          {isCorrect ? 'Masterful Deduction, Detective.' : 'The True Culprit Evaded You.'}
        </h1>

        <p className="text-sm text-noir-300 max-w-2xl mx-auto leading-relaxed">
          {result?.feedback}
        </p>

        {/* 100-Point Score Grid */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="bg-noir-950/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono uppercase text-noir-400 block font-semibold">
              Final Detective Score
            </span>
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {score} <span className="text-xs text-noir-400 font-normal">/ 100</span>
            </span>
          </div>

          <div className="bg-noir-950/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono uppercase text-noir-400 block font-semibold">
              Culprit Identified
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {breakdown.culpritScore} <span className="text-xs text-noir-400 font-normal">/ 70</span>
            </span>
          </div>

          <div className="bg-noir-950/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono uppercase text-noir-400 block font-semibold">
              Evidence Explored
            </span>
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {breakdown.evidenceScore} <span className="text-xs text-noir-400 font-normal">/ 20</span>
            </span>
          </div>

          <div className="bg-noir-950/80 p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono uppercase text-noir-400 block font-semibold">
              Decisive Clues Found
            </span>
            <span className="text-2xl font-bold font-mono text-amber-400">
              {breakdown.clueScore} <span className="text-xs text-noir-400 font-normal">/ 10</span>
            </span>
          </div>
        </div>
      </div>

      {/* Suspect Comparison Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-noir-900 border border-noir-800 rounded-2xl p-6 space-y-3">
          <span className="text-[11px] font-mono text-noir-400 uppercase tracking-wider block font-semibold">
            Your Chosen Accusation
          </span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-noir-950 border border-noir-700 flex items-center justify-center font-bold text-lg font-mono text-white">
              {selectedSuspect?.name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-cinzel">{selectedSuspect?.name}</h3>
              <p className="text-xs font-mono text-noir-400">{selectedSuspect?.role}</p>
            </div>
          </div>
          <div className="pt-2 text-xs text-noir-300">
            {isCorrect ? (
              <span className="text-emerald-400 font-medium">Verified Perpetrator</span>
            ) : (
              <span className="text-red-400 font-medium">Falsely Accused Innocent Party</span>
            )}
          </div>
        </div>

        <div className="bg-noir-900 border border-emerald-900/50 rounded-2xl p-6 space-y-3">
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block font-semibold">
            The Canonical Perpetrator
          </span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center font-bold text-lg font-mono text-emerald-300">
              {realCulprit?.name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-cinzel">{realCulprit?.name}</h3>
              <p className="text-xs font-mono text-emerald-400">{realCulprit?.role}</p>
            </div>
          </div>
          <div className="pt-2 text-xs text-noir-300">
            True Culprit responsible for the incident.
          </div>
        </div>
      </div>

      {/* Full Detective Solution Narrative */}
      <div className="bg-noir-900 border border-noir-800 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-emerald-400">
          <FileCheck className="w-6 h-6" />
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
            Comprehensive Case Breakdown
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-4">
            <div className="bg-noir-950 p-4 rounded-xl border border-noir-800">
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider font-semibold block mb-1">
                Culprit Motive Revealed
              </span>
              <p className="text-noir-200 leading-relaxed">{solution?.motive}</p>
            </div>

            <div className="bg-noir-950 p-4 rounded-xl border border-noir-800">
              <span className="font-mono text-[10px] text-red-400 uppercase tracking-wider font-semibold block mb-1">
                Execution Method & Security Breach
              </span>
              <p className="text-noir-200 leading-relaxed">{solution?.method}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-noir-950 p-4 rounded-xl border border-noir-800">
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-semibold block mb-1">
                The Logical Contradiction / Opportunity
              </span>
              <p className="text-noir-200 leading-relaxed">{solution?.opportunity}</p>
            </div>

            <div className="bg-noir-950 p-4 rounded-xl border border-noir-800">
              <span className="font-mono text-[10px] text-purple-400 uppercase tracking-wider font-semibold block mb-1">
                Decisive Evidence Correlation
              </span>
              <p className="text-noir-200 leading-relaxed">
                Evidence items matching decisive IDs [{solution?.decisiveEvidenceIds?.join(', ')}] cracked the false alibi.
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Reconstruction */}
        <div className="bg-noir-950 p-6 rounded-2xl border border-noir-800 space-y-2">
          <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-bold block">
            Reconstructed Crime Sequence
          </span>
          <p className="text-xs sm:text-sm text-noir-200 leading-relaxed whitespace-pre-wrap">
            {solution?.explanation}
          </p>
        </div>

        {/* Red Herrings Explained */}
        {solution?.redHerringExplanations?.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-noir-800">
            <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Red Herrings & Misdirection Clarified
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solution.redHerringExplanations.map((rh, idx) => (
                <div key={idx} className="bg-noir-950 p-4 rounded-xl border border-noir-800 text-xs space-y-1.5">
                  <span className="font-bold text-amber-400 font-mono block">
                    {rh.clueOrSuspect}
                  </span>
                  <p className="text-noir-400">
                    <strong className="text-noir-300">Misdirection:</strong> {rh.misdirection}
                  </p>
                  <p className="text-emerald-300/90">
                    <strong className="text-emerald-400">The Truth:</strong> {rh.truth}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link to="/create">
          <Button variant="primary" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            <span>Generate New Case</span>
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="secondary" size="lg">
            <Compass className="w-4 h-4 mr-2" />
            <span>Return to Bureau Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
