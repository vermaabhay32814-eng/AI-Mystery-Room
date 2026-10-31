import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useCase from '../hooks/useCase'
import { discoverClue, requestHint } from '../services/caseApi'
import SuspectCard from '../components/SuspectCard'
import ClueCard from '../components/ClueCard'
import HintPanel from '../components/HintPanel'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'
import { difficultyColors, formatDifficulty, countDiscoveredClues } from '../utils/helpers'

// Skeleton loader
function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

function InvestigationSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 animate-pulse">
      <SkeletonBlock className="h-8 w-64 mb-2" />
      <SkeletonBlock className="h-4 w-full max-w-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="space-y-4">
          <SkeletonBlock className="h-48 rounded-xl" />
          <SkeletonBlock className="h-24 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function InvestigationRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { caseData, loading, error, updateCase } = useCase(id)

  const [discoveringClues, setDiscoveringClues] = useState({}) // { clueId: bool }
  const [hintLoading, setHintLoading] = useState(false)
  const [hintError, setHintError] = useState(null)

  // If case is already completed, redirect to results
  useEffect(() => {
    if (caseData?.status === 'completed') {
      navigate(`/case/${id}/results`, { replace: true })
    }
  }, [caseData, id, navigate])

  const handleDiscoverClue = async (clueId) => {
    setDiscoveringClues((prev) => ({ ...prev, [clueId]: true }))
    try {
      const updated = await discoverClue(id, clueId)
      // Update the specific clue in local state
      updateCase((prev) => {
        if (!prev) return prev
        const clues = prev.clues?.map((c) => {
          const cId = c.id || c._id
          if (cId === clueId || cId === (updated.clue?.id || updated.clue?._id)) {
            return { ...c, ...updated.clue, status: 'discovered' }
          }
          return c
        })
        return { ...prev, clues }
      })
    } catch (err) {
      console.error('Discover clue error:', err)
    } finally {
      setDiscoveringClues((prev) => ({ ...prev, [clueId]: false }))
    }
  }

  const handleRequestHint = async () => {
    setHintLoading(true)
    setHintError(null)
    try {
      const data = await requestHint(id)
      updateCase((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          hints: {
            ...prev.hints,
            revealed: data.hints?.revealed ?? [...(prev.hints?.revealed || []), data.hint],
            used: data.hints?.used ?? (prev.hints?.used || 0) + 1,
            remaining: data.hints?.remaining ?? (prev.hints?.remaining || 1) - 1,
          },
        }
      })
    } catch (err) {
      if (err.message === 'You have used all available hints.') {
        setHintError('You have used all available hints.')
      } else {
        setHintError(err.message)
      }
    } finally {
      setHintLoading(false)
    }
  }

  // Loading state
  if (loading) return <InvestigationSkeleton />

  // Error state
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-serif font-bold text-slate-100 mb-2">Mystery Not Found</h2>
        <p className="text-slate-400 mb-6 max-w-sm">
          {error === 'This mystery could not be found.'
            ? 'This mystery could not be found. It may have been deleted or the link is incorrect.'
            : error}
        </p>
        <Link to="/create">
          <Button variant="primary">Create New Mystery</Button>
        </Link>
      </div>
    )
  }

  if (!caseData) return null

  const suspects = caseData.suspects || []
  const clues = caseData.clues || []
  const discoveredCount = countDiscoveredClues(clues)
  const totalClues = clues.length
  const hints = caseData.hints || {}

  return (
    <div className="page-enter py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
              {caseData.title || 'Investigation'}
            </h1>
            <span className={`badge text-sm ${difficultyColors(caseData.difficulty)}`}>
              {formatDifficulty(caseData.difficulty)}
            </span>
          </div>
          {caseData.premise && (
            <p className="text-slate-400 text-sm max-w-3xl mb-4 italic">
              "{caseData.premise}"
            </p>
          )}

          {/* Progress */}
          <div className="max-w-sm">
            <ProgressBar current={discoveredCount} total={totalClues} />
          </div>
        </div>

        {/* Story */}
        {caseData.story && (
          <div className="mystery-card mb-8 border-amber-800/30 bg-amber-950/10">
            <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">
              📖 The Story
            </h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{caseData.story}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Suspects + Clues */}
          <div className="lg:col-span-2 space-y-8">
            {/* Suspects */}
            <section>
              <h2 className="section-heading flex items-center gap-2">
                <span>🧑‍💼</span> Suspects
                <span className="text-sm text-slate-500 font-sans font-normal">
                  ({suspects.length})
                </span>
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Study each suspect carefully. One of them is the culprit.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suspects.map((suspect) => (
                  <SuspectCard
                    key={suspect.id || suspect._id}
                    suspect={suspect}
                    selectable={false}
                  />
                ))}
              </div>
            </section>

            {/* Clues */}
            <section>
              <h2 className="section-heading flex items-center gap-2">
                <span>🔍</span> Evidence & Clues
                <span className="text-sm text-slate-500 font-sans font-normal">
                  ({discoveredCount}/{totalClues} discovered)
                </span>
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Discover clues to build your case. Each clue brings you closer to the truth.
              </p>
              <div className="space-y-3">
                {clues.map((clue) => {
                  const clueId = clue.id || clue._id
                  return (
                    <ClueCard
                      key={clueId}
                      clue={clue}
                      onDiscover={handleDiscoverClue}
                      isDiscovering={!!discoveringClues[clueId]}
                    />
                  )
                })}
              </div>
            </section>
          </div>

          {/* Right: Hints + Actions */}
          <div className="space-y-6">
            {/* Hint Panel */}
            <HintPanel
              revealedHints={hints.revealed || []}
              hintsUsed={hints.used || 0}
              hintsRemaining={hints.remaining ?? hints.total ?? 0}
              onRequestHint={handleRequestHint}
              isLoading={hintLoading}
              error={hintError}
            />

            {/* Make Accusation */}
            <div className="mystery-card border-amber-700/30 bg-amber-950/10">
              <h3 className="font-serif font-semibold text-amber-400 mb-2">
                ⚖️ Ready to Accuse?
              </h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                When you're confident in your deductions, make your final accusation. Choose
                wisely — it cannot be undone.
              </p>
              <Link to={`/case/${id}/accuse`}>
                <Button variant="primary" size="md" className="w-full">
                  Make an Accusation
                </Button>
              </Link>
            </div>

            {/* Case Meta */}
            <div className="mystery-card text-sm text-slate-500 space-y-2">
              <div className="flex justify-between">
                <span>Case ID</span>
                <span className="text-slate-400 font-mono text-xs truncate ml-2">{id}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-green-400 capitalize">{caseData.status || 'active'}</span>
              </div>
              <div className="flex justify-between">
                <span>Clue progress</span>
                <span className="text-slate-300">
                  {discoveredCount}/{totalClues}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
