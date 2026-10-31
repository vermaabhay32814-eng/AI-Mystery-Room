import { Link } from 'react-router-dom'
import Button from '../components/Button'

const STEPS = [
  {
    icon: '✏️',
    step: '01',
    title: 'Create',
    desc: 'Describe any premise — a haunted manor, a corporate heist, a seaside village. Our AI crafts the full mystery.',
  },
  {
    icon: '🔎',
    step: '02',
    title: 'Investigate',
    desc: 'Question suspects, discover clues, and request hints. Every case is uniquely generated just for you.',
  },
  {
    icon: '⚖️',
    step: '03',
    title: 'Solve',
    desc: 'Make your accusation when ready. The truth (and your score) will be revealed.',
  },
]

const DIFFICULTIES = [
  {
    level: 'Easy',
    emoji: '🌿',
    desc: 'Perfect for beginners',
    suspects: 3,
    clues: 5,
    hints: 3,
    color: 'border-green-700/50 hover:border-green-600',
    badge: 'bg-green-900/50 text-green-300 border border-green-700',
  },
  {
    level: 'Medium',
    emoji: '🕵️',
    desc: 'A true detective challenge',
    suspects: 4,
    clues: 7,
    hints: 2,
    color: 'border-amber-700/50 hover:border-amber-600',
    badge: 'bg-amber-900/50 text-amber-300 border border-amber-700',
  },
  {
    level: 'Hard',
    emoji: '💀',
    desc: 'Only the sharpest minds prevail',
    suspects: 5,
    clues: 9,
    hints: 1,
    color: 'border-red-700/50 hover:border-red-600',
    badge: 'bg-red-900/50 text-red-300 border border-red-700',
  },
]

export default function Home() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-20 px-4">
        {/* Background atmosphere */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-10 left-10 text-8xl opacity-5 rotate-[-15deg]">🔍</div>
          <div className="absolute top-20 right-20 text-6xl opacity-5 rotate-[20deg]">🗝️</div>
          <div className="absolute bottom-10 left-1/4 text-7xl opacity-5 rotate-[10deg]">🕯️</div>
          <div className="absolute bottom-20 right-10 text-5xl opacity-5 rotate-[-10deg]">📜</div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-sm font-medium mb-6">
            <span>✨</span> AI-Powered Detective Mysteries
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-5 leading-tight">
            AI{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Mystery
            </span>{' '}
            Room
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn any premise into a fully solvable detective mystery — powered by Gemini AI.
            Every case is unique, every clue matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/create">
              <Button variant="primary" size="lg" className="shadow-lg shadow-amber-500/20">
                🕵️ Create Mystery
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="ghost" size="lg">
                How it works ↓
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-3">
              How It Works
            </h2>
            <p className="text-slate-400">Three simple steps to your personalized mystery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector lines (desktop) */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />

            {STEPS.map((s, idx) => (
              <div key={idx} className="mystery-card text-center group hover:border-amber-700/50">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-amber-600 text-xs font-bold tracking-widest mb-2">
                  STEP {s.step}
                </div>
                <h3 className="font-serif font-semibold text-white text-xl mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Difficulty Overview */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-3">
              Choose Your Challenge
            </h2>
            <p className="text-slate-400">Pick the difficulty that matches your detective skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIFFICULTIES.map((d) => (
              <div
                key={d.level}
                className={`mystery-card ${d.color} text-center hover:scale-[1.02] transition-transform`}
              >
                <div className="text-4xl mb-3">{d.emoji}</div>
                <div className={`badge mx-auto mb-3 ${d.badge}`}>{d.level}</div>
                <p className="text-slate-400 text-sm mb-5">{d.desc}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Suspects</span>
                    <span className="font-semibold">{d.suspects}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Clues</span>
                    <span className="font-semibold">{d.clues}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-500">Hints</span>
                    <span className="font-semibold">{d.hints}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-slate-950">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🗝️</div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-4">
            Ready to Solve the Case?
          </h2>
          <p className="text-slate-400 mb-8">
            Every mystery is unique. Every clue is a puzzle piece. Every accusation — final.
          </p>
          <Link to="/create">
            <Button variant="primary" size="lg" className="shadow-xl shadow-amber-500/20">
              🕵️ Start Investigating
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-4 text-center text-slate-600 text-sm">
        <p>🔍 AI Mystery Room — Powered by Gemini AI</p>
      </footer>
    </div>
  )
}
