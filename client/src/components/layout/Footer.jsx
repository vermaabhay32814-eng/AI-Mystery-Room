// client/src/components/layout/Footer.jsx
import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-noir-800/80 bg-noir-950/60 py-8 text-xs text-noir-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>AI Mystery Room — Powered by Google Gemini</span>
        </div>

        <div className="flex items-center gap-4 text-noir-400 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-amber-400/80">
            <Sparkles className="w-3.5 h-3.5" />
            ALL CASES & EVIDENCE ARE STRICTLY FICTIONAL
          </span>
        </div>

        <div>
          <span>© {new Date().getFullYear()} AI Mystery Room. Single Source of Truth: SPEC.md</span>
        </div>
      </div>
    </footer>
  );
};
