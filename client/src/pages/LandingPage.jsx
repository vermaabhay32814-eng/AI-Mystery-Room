// client/src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, MessageSquare, Video, FileSearch, ArrowRight, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';

export const LandingPage = () => {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GENERATIVE DETECTIVE SIMULATION • POWERED BY GEMINI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold font-cinzel text-white tracking-tight leading-tight">
          Every Mystery Leaves a Trace.
        </h1>

        <p className="text-base sm:text-lg text-noir-300 max-w-2xl mx-auto leading-relaxed">
          Provide any story prompt or scenario. Google Gemini crafts a complete, self-consistent fictional investigation with suspects, digital chat logs, CCTV records, forensic clues, and a hidden truth waiting to be deduced.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/create">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <span>Create a Mystery</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/create">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              <span>Explore Demo Case</span>
            </Button>
          </Link>
        </div>

        {/* Fictional Disclaimer pill */}
        <div className="pt-2 text-[11px] font-mono text-noir-400 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>All characters, evidence, and investigations are 100% fictional.</span>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">How The Investigation Unfolds</h2>
          <p className="text-xs sm:text-sm text-noir-400">From a single scenario prompt to an immersive forensic workspace.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-noir-900 border border-noir-800/80 rounded-2xl p-6 space-y-3 relative">
            <span className="font-mono text-xs text-emerald-400 font-bold">01. PROMPT</span>
            <h3 className="text-base font-semibold text-white">Give Your Scenario</h3>
            <p className="text-xs text-noir-300 leading-relaxed">
              Describe a theft, missing artifact, or corporate heist in your own words, or pick from our curated genres.
            </p>
          </div>

          <div className="bg-noir-900 border border-noir-800/80 rounded-2xl p-6 space-y-3 relative">
            <span className="font-mono text-xs text-cyan-400 font-bold">02. GENERATION</span>
            <h3 className="text-base font-semibold text-white">Gemini Architecture</h3>
            <p className="text-xs text-noir-300 leading-relaxed">
              AI crafts a coherent canonical blueprint, timeline, suspect motives, and interlocking forensic evidence items.
            </p>
          </div>

          <div className="bg-noir-900 border border-noir-800/80 rounded-2xl p-6 space-y-3 relative">
            <span className="font-mono text-xs text-purple-400 font-bold">03. INVESTIGATE</span>
            <h3 className="text-base font-semibold text-white">Examine Evidence</h3>
            <p className="text-xs text-noir-300 leading-relaxed">
              Analyze WhatsApp conversations, camera transcripts, and forensic reports. Piece together contradictions.
            </p>
          </div>

          <div className="bg-noir-900 border border-noir-800/80 rounded-2xl p-6 space-y-3 relative">
            <span className="font-mono text-xs text-amber-400 font-bold">04. ACCUSE</span>
            <h3 className="text-base font-semibold text-white">Solve & Score</h3>
            <p className="text-xs text-noir-300 leading-relaxed">
              Accuse the culprit. Unlock the canonical explanation, reconstructed timeline, and your 100-point detective score.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Evidence Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-noir-900 border border-noir-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="emerald">FORENSIC ARTIFACT ENGINE</Badge>
              <h2 className="text-3xl font-bold font-cinzel text-white leading-tight">
                Simulated Digital Artifacts, Not Plain Text.
              </h2>
              <p className="text-xs sm:text-sm text-noir-300 leading-relaxed">
                Step into a modern detective room where clues take the shape of authentic digital evidence: timestamped CCTV anomaly logs, encrypted chat exports, employee badge swipes, and forensics.
              </p>
              <div className="pt-2">
                <Link to="/create">
                  <Button variant="primary" size="md">
                    Launch An Investigation Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Preview Card Showcase */}
            <div className="space-y-3">
              <div className="bg-noir-950 border border-noir-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Simulated Chat Transcripts</h4>
                    <span className="text-[10px] text-noir-400 font-mono">WhatsApp & Messenger Logs</span>
                  </div>
                </div>
                <Badge variant="emerald">FICTIONAL</Badge>
              </div>

              <div className="bg-noir-950 border border-noir-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Simulated CCTV Logs</h4>
                    <span className="text-[10px] text-noir-400 font-mono">Camera Transcripts & Blind Spots</span>
                  </div>
                </div>
                <Badge variant="blue">FICTIONAL</Badge>
              </div>

              <div className="bg-noir-950 border border-noir-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40">
                    <FileSearch className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Forensic Crime Reports</h4>
                    <span className="text-[10px] text-noir-400 font-mono">Trace Analysis & Biometric Swipes</span>
                  </div>
                </div>
                <Badge variant="purple">FICTIONAL</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
