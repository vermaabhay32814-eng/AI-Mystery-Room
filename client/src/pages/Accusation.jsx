import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useCase from '../hooks/useCase'
import { submitAccusation } from '../services/caseApi'
import SuspectCard from '../components/SuspectCard'
import Button from '../components/Button'

function AccusationSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 animate-pulse">
      <div className="skeleton h-8 w-56 rounded" />
      <div className="skeleton h-4 w-full max-w-md rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-40 rounded-xl" />
        ))}
      </div>
      <div className="skeleton h-12 w-48 rounded-lg" />
    </div>
  )
}

export default function Accusation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { caseData, loading, error } = useCase(id)

  const [selectedSuspectId, setSelectedSuspectId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // If case is already completed, redirect to results
  useEffect(() => {
    if (caseData?.status === 'completed') {
      navigate(`/case/${id}/results`, { replace: true })
    }
  }, [caseData, id, navigate])

  const handleAccuse = async () => {
    if (!selectedSuspectId) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await submitAccusation(id, selectedSuspectId)
      navigate(`/case/${id}/results`)
    } catch (err) {
      if (err.message === 'CASE_ALREADY_COMPLETED') {
        navigate(`/case/${id}/results`, { replace: true })
      } else {
        setSubmitError(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <AccusationSkeleton />

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-serif font-bold text-slate-100 mb-2">Mystery Not Found</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <Link to="/create">
          <Button variant="primary">Create New Mystery</Button>
        </Link>
      </div>
    )
  }

  if (!caseData) return null

  const suspects = caseData.suspects || []

  return (
    <div className="page-enter py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚖️</div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            Make Your Accusation
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            Review your evidence carefully before making your accusation.{' '}
            <span className="text-amber-400 font-medium">This decision is final.</span>
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl px-5 py-4 flex items-start gap-3 mb-8">
          <span className="text-2xl shrink-0">⚠️</span>
          <p className="text-red-300 text-sm leading-relaxed">
            <span className="font-semibold">This accusation is final and cannot be changed.</span>{' '}
            Once you submit, the case will be closed and you'll see the full solution.
          </p>
        </div>

        {/* Suspect Grid */}
        <div className="mb-8">
          <h2 className="section-heading mb-1">Select Your Suspect</h2>
          <p className="text-slate-500 text-sm mb-5">
            Click on a suspect to select them as your accusation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suspects.map((suspect) => {
              const sId = suspect.id || suspect._id
              return (
                <SuspectCard
                  key={sId}
                  suspect={suspect}
                  isSelected={selectedSuspectId === sId}
                  onSelect={setSelectedSuspectId}
                  selectable={!submitting}
                />
              )
            })}
          </div>
        </div>

        {/* Error */}
        {submitError && (
          <div className="mb-6 bg-red-900/20 border border-red-700/50 rounded-xl px-5 py-4 flex gap-3">
            <span className="text-red-400 text-xl shrink-0">⚠️</span>
            <p className="text-red-300 text-sm">{submitError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            disabled={!selectedSuspectId || submitting}
            loading={submitting}
            onClick={handleAccuse}
            className="w-full sm:w-auto shadow-lg shadow-amber-500/20"
          >
            {submitting ? 'Submitting…' : '⚖️ Submit Accusation'}
          </Button>

          <Link
            to={`/case/${id}`}
            className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            ← Back to Investigation
          </Link>
        </div>

        {!selectedSuspectId && (
          <p className="text-slate-500 text-xs mt-3 text-center sm:text-left">
            Select a suspect above to enable the submit button.
          </p>
        )}
      </div>
    </div>
  )
}
