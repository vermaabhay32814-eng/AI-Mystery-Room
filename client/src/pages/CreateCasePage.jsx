// client/src/pages/CreateCasePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield, AlertTriangle, ArrowRight, Wand2, Compass } from 'lucide-react';
import { caseService } from '../services/case.service.js';
import { Button } from '../components/ui/Button.jsx';

const SAMPLE_SCENARIOS = [
  {
    title: 'The Diamond Gallery Disappearance',
    genre: 'theft',
    difficulty: 'medium',
    text: 'A priceless 50-carat blue diamond disappeared from a hermetically sealed museum display case during an exclusive donors banquet. Four individuals had access to the master security vault.'
  },
  {
    title: 'The St. Jude Harbor Cyber Breach',
    genre: 'cyber',
    difficulty: 'hard',
    text: 'A cryptographic decryption key was extracted from an air-gapped terminal at the maritime port authority during midnight maintenance. The security camera lost signal for exactly four minutes.'
  },
  {
    title: 'The Heritage Foundation Secret',
    genre: 'corporate',
    difficulty: 'medium',
    text: 'The founding charter of an aristocratic dynasty vanished from the family lawyer\'s private vault hours before probate court. Three heirs and the head butler were on the estate grounds.'
  }
];

export const CreateCasePage = () => {
  const [scenario, setScenario] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('general');
  const [difficulty, setDifficulty] = useState('medium');
  const [suspectCount, setSuspectCount] = useState(4);
  const [evidenceDensity, setEvidenceDensity] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSelectSample = (sample) => {
    setScenario(sample.text);
    setTitle(sample.title);
    setGenre(sample.genre);
    setDifficulty(sample.difficulty);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (scenario.trim().length < 50) {
      return setError('Please provide at least 50 characters describing the incident.');
    }

    setIsGenerating(true);

    try {
      const res = await caseService.createCase({
        scenario: scenario.trim(),
        title: title.trim() || undefined,
        genre,
        difficulty,
        suspectCount: parseInt(suspectCount, 10),
        evidenceDensity
      });

      if (res.success && res.data?.caseId) {
        navigate(`/investigation/${res.data.caseId}`);
      } else {
        throw new Error('Case generation returned incomplete response');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate mystery case. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
          AI Mystery Commission
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-cinzel text-white">
          Architect an Investigation
        </h1>
        <p className="text-xs sm:text-sm text-noir-300">
          Provide your story premise. Google Gemini will engineer a self-consistent web of suspects, forensic trails, and one definitive culprit.
        </p>
      </div>

      {/* Sample Scenario Inspiration */}
      <div className="space-y-3">
        <span className="text-xs font-mono text-noir-400 uppercase tracking-wider block">
          Quick Start With A Pre-Crafted Premise:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_SCENARIOS.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className="p-3.5 rounded-xl bg-noir-900 border border-noir-800 hover:border-noir-700 hover:bg-noir-850 cursor-pointer transition text-left space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white group-hover:text-emerald-400 transition">
                  {sample.title}
                </span>
                <span className="text-[10px] font-mono text-noir-400 uppercase">{sample.genre}</span>
              </div>
              <p className="text-[11px] text-noir-400 line-clamp-2 leading-relaxed">{sample.text}</p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="bg-noir-900 border border-noir-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Scenario prompt textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-noir-300 uppercase tracking-wider">
              Mystery Scenario / Story Seed <span className="text-red-400">*</span>
            </label>
            <span className="text-[11px] font-mono text-noir-400">
              {scenario.length} / 2,000 chars (min 50)
            </span>
          </div>

          <textarea
            required
            rows={5}
            maxLength={2000}
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Describe the incident: What vanished or happened? Where was the crime scene? Who was present? (e.g. A valuable diamond disappeared from a locked museum vault during a private gala. Four individuals had access...)"
            className="w-full bg-noir-950 border border-noir-800 rounded-2xl p-4 text-xs sm:text-sm text-noir-100 placeholder-noir-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed font-sans"
          />
        </div>

        {/* Custom optional title */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-noir-300 uppercase tracking-wider block">
            Custom Case Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Midnight Sovereign Vanishing (or leave blank for AI generation)"
            className="w-full bg-noir-950 border border-noir-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-noir-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Configuration grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
          {/* Genre */}
          <div className="space-y-1.5">
            <label className="text-noir-400 font-mono text-[11px] uppercase block">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-noir-950 border border-noir-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="general">General Mystery</option>
              <option value="theft">High-Stakes Theft</option>
              <option value="murder">Murder Mystery</option>
              <option value="cyber">Cyber Espionage</option>
              <option value="corporate">Corporate Intrigue</option>
              <option value="missing_person">Missing Person</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-noir-400 font-mono text-[11px] uppercase block">Deduction Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-noir-950 border border-noir-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="easy">Easy (Direct clues)</option>
              <option value="medium">Medium (Red herrings)</option>
              <option value="hard">Hard (Complex logs & forensic ties)</option>
            </select>
          </div>

          {/* Suspect count */}
          <div className="space-y-1.5">
            <label className="text-noir-400 font-mono text-[11px] uppercase block">Suspect Count</label>
            <select
              value={suspectCount}
              onChange={(e) => setSuspectCount(e.target.value)}
              className="w-full bg-noir-950 border border-noir-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value={3}>3 Suspects</option>
              <option value={4}>4 Suspects (Standard)</option>
              <option value={5}>5 Suspects</option>
              <option value={6}>6 Suspects</option>
            </select>
          </div>

          {/* Evidence density */}
          <div className="space-y-1.5">
            <label className="text-noir-400 font-mono text-[11px] uppercase block">Evidence Artifacts</label>
            <select
              value={evidenceDensity}
              onChange={(e) => setEvidenceDensity(e.target.value)}
              className="w-full bg-noir-950 border border-noir-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="light">Light (4-5 Items)</option>
              <option value="standard">Standard (5-7 Items)</option>
              <option value="detailed">Detailed (7-9 Items)</option>
            </select>
          </div>
        </div>

        {/* Fictional Disclaimer */}
        <div className="p-4 rounded-xl bg-noir-950/80 border border-noir-800 flex items-start gap-3 text-xs text-noir-400">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-noir-200">Safety & Fiction Guarantee:</strong> Stories are strictly converted into fictional scenarios. Never accuse real-world individuals or enter real-world private communications.
          </span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isGenerating || scenario.trim().length < 50}
          isLoading={isGenerating}
        >
          <Wand2 className="w-5 h-5 mr-2" />
          <span>{isGenerating ? 'Synthesizing Mystery with Gemini...' : 'Generate Playable Mystery'}</span>
        </Button>
      </form>
    </div>
  );
};
