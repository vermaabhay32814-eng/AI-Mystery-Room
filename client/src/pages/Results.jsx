import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getResult } from '../services/caseApi'
import Button from '../components/Button'

function ResultSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 animate-pulse">
      <div className="skeleton h-16 w-48 mx-auto rounded-xl" />
      <div className="skeleton h-6 w-64 mx-auto rounded" />
      <div className="skeleton h-32 rounded-xl" />
      <div className="skeleton h-48 rounded-xl" />
    </div>
  )
}

export default function Results() {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchResult() {
      setLoading(true)
      setError(null)
      try {
        const data = await getResult(id)
        if (!cancelled) setResult(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchResult()
    return () => { cancelled = true }
  }, [id])

  if (loading) return <ResultSkeleton />

  if (error) {
    const notCompleted = error.toLowerCase().includes('not completed') ||
      error.toLowerCase().includes('no result') ||
      error.toLowerCase().includes('not found')
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">{notCompleted ? '⏳' : '🔍'}</div>
        <h2 className="text-2xl font-serif font-bold text-slate-100 mb-2">
          {notCompleted ? 'Case Not Completed Yet' : 'Result Not Found'}
        </h2>
        <p className="text-slate-400 mb-6 max-w-sm">{error}</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {notCompleted && (
            <Link to={`/case/${id}`}>
              <Button variant="secondary">Back to Investigation</Button>
            </Link>
          )}
          <Link to="/create">
            <Button variant="primary">Create New Mystery</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!result) return null

  const isCorrect = result.correct === true
  const score = result.score || {}
  const solution = result.solution || {}
  const accusedSuspect = result.accusedSuspect
  const culprit = result.culprit || solution.culprit

  // Score computation
  const basePoints = score.base ?? 100
  const cluesDiscovered = score.cluesDiscovered ?? 0
  const cluePointsEach = score.cluePointsEach ?? 5
  const clueBonus = score.clueBonus ?? cluesDiscovered * cluePointsEach
  const hintsUsed = score.hintsUsed ?? 0
  const hintPenaltyEach = score.hintPenaltyEach ?? 10
  const hintPenalty = score.hintPenalty ?? hintsUsed * hintPenaltyEach
  const total = score.total ?? basePoints + clueBonus - hintPenalty

  return (
    <div className="page-enter py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Verdict banner */}
        <div
          className={`rounded-2xl p-8 text-center mb-8 border ${
            isCorrect
              ? 'bg-green-900/20 border-green-700/50'
              : 'bg-red-900/20 border-red-700/50'
          }`}
        >
          <div className="text-7xl mb-4">{isCorrect ? '✅' : '❌'}</div>
          <h1
            className={`text-4xl md:text-5xl font-serif font-bold mb-2 ${
              isCorrect ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isCorrect ? 'CORRECT!' : 'WRONG!'}
          </h1>
          <p className="text-slate-300 text-lg">
            {isCorrect
              ? 'Brilliant deduction, Detective! You solved the case.'
              : 'The culprit slipped through your fingers this time.'}
          </p>
        </div>

        {/* Accusation vs Truth */}
        <div className="mystery-card mb-6">
          <h2 className="font-serif font-semibold text-slate-100 text-xl mb-4">
            🎭 The Verdict
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                Your Accusation
              </p>
              <p className="text-slate-100 font-semibold text-lg">
                {accusedSuspect?.name || result.accusedSuspectName || '—'}
              </p>
              {accusedSuspect?.role && (
                <p className="text-slate-400 text-sm">{accusedSuspect.role}</p>
              )}
            </div>
            <div
              className={`rounded-xl p-4 border ${
                isCorrect
                  ? 'bg-green-900/20 border-green-700/50'
                  : 'bg-amber-900/20 border-amber-700/50'
              }`}
            >
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                Actual Culprit
              </p>
              <p
                className={`font-semibold text-lg ${
                  isCorrect ? 'text-green-300' : 'text-amber-300'
                }`}
              >
                {culprit?.name || result.culpritName || '—'}
              </p>
              {culprit?.role && (
                <p className="text-slate-400 text-sm">{culprit.role}</p>
              )}
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className="mystery-card mb-6">
          <h2 className="font-serif font-semibold text-slate-100 text-xl mb-4">
            🔍 The Full Solution
          </h2>
          <div className="space-y-4">
            {solution.motive && (
              <div>
                <p className="text-xs text-amber-500 uppercase tracking-wide font-semibold mb-1">
                  Motive
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">{solution.motive}</p>
              </div>
            )}
            {solution.method && (
              <div>
                <p className="text-xs text-amber-500 uppercase tracking-wide font-semibold mb-1">
                  Method
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">{solution.method}</p>
              </div>
            )}
            {solution.explanation && (
              <div>
                <p className="text-xs text-amber-500 uppercase tracking-wide font-semibold mb-1">
                  Full Explanation
                </p>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {solution.explanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mystery-card mb-8">
          <h2 className="font-serif font-semibold text-slate-100 text-xl mb-4">
            🏆 Score Breakdown
          </h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-slate-300">
              <span>Base points</span>
              <span className="font-mono text-green-400">+{basePoints}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>
                Clue bonus{' '}
                <span className="text-slate-500">
                  ({cluesDiscovered} × {cluePointsEach} pts)
                </span>
              </span>
              <span className="font-mono text-green-400">+{clueBonus}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>
                Hint penalty{' '}
                <span className="text-slate-500">
                  ({hintsUsed} × -{hintPenaltyEach} pts)
                </span>
              </span>
              <span className="font-mono text-red-400">-{hintPenalty}</span>
            </div>
            <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between">
              <span className="font-semibold text-slate-100 text-base">Total Score</span>
              <span className="font-mono font-bold text-amber-400 text-xl">{total}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link to="/create">
            <Button variant="primary" size="lg" className="shadow-lg shadow-amber-500/20">
              🕵️ Play Again
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="lg">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
