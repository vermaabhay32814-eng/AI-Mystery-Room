import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyCases } from '../services/caseApi'
import Button from '../components/Button'
import { difficultyColors } from '../utils/helpers'

export default function Dashboard() {
  const { user, refreshUser } = useAuth()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    refreshUser()
    async function fetchCases() {
      try {
        setLoading(true)
        const caseList = await getMyCases()
        setCases(caseList)
      } catch (err) {
        setError(err.message || 'Failed to load case files.')
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [])

  const stats = user?.stats || { casesPlayed: 0, casesSolved: 0, totalScore: 0 }
  const solveRate = stats.casesPlayed > 0 ? Math.round((stats.casesSolved / stats.casesPlayed) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl">
              🕵️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
                  Detective {user?.username}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  Special Agent
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {user?.email} • Enlisted {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Link to="/create">
            <Button variant="primary" size="md">
              + Open New Mystery
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cases Assigned</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{stats.casesPlayed}</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Solved Cases</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.casesSolved}</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Clearance Rate</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{solveRate}%</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Score</p>
            <p className="text-2xl font-bold text-indigo-300 mt-1">{stats.totalScore} pts</p>
          </div>
        </div>
      </div>

      {/* Case Dossier Archive */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <span>📁</span> Case Dossier & History
          </h2>
          <span className="text-sm text-slate-400">
            {cases.length} {cases.length === 1 ? 'file' : 'files'} recorded
          </span>
        </div>

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-900/60 rounded-xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 space-y-4">
            <div className="text-4xl">🗂️</div>
            <h3 className="text-lg font-medium text-slate-200">No Case Files on Record</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Your investigator dossier is empty. Generate your first mystery to test your deductive skills!
            </p>
            <Link to="/create">
              <Button variant="primary" size="md">
                Investigate Your First Case
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.map((c) => {
              const isCompleted = c.status === 'completed'
              const isSolved = c.isCorrect
              const diffColor = difficultyColors[c.difficulty] || 'bg-slate-700 text-slate-300'

              return (
                <div
                  key={c.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 sm:p-6 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${diffColor}`}>
                        {c.difficulty}
                      </span>

                      {isCompleted ? (
                        isSolved ? (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                            ✓ Solved (+{c.score?.total || 0} pts)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-950/80 border border-rose-800 text-rose-400">
                            ✗ Unsolved ({c.score?.total || 0} pts)
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-950/80 border border-amber-800 text-amber-300 animate-pulse">
                          Active Investigation
                        </span>
                      )}

                      <span className="text-xs text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-slate-100 truncate">
                      {c.title}
                    </h3>

                    <p className="text-sm text-slate-400 line-clamp-2">
                      {c.premise}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    {isCompleted ? (
                      <Link to={`/case/${c.id}/results`}>
                        <Button variant="secondary" size="sm">
                          Inspect Verdict →
                        </Button>
                      </Link>
                    ) : (
                      <Link to={`/case/${c.id}`}>
                        <Button variant="primary" size="sm">
                          Resume Case →
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

