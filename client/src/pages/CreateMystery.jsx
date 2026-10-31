import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCase } from '../services/caseApi'
import Button from '../components/Button'

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'Easy',
    emoji: '🌿',
    desc: '3 suspects, 5 clues, 3 hints — perfect for beginners',
    color: 'border-green-700/60 hover:border-green-500',
    selectedColor: 'border-green-500 bg-green-900/20 ring-2 ring-green-500/40',
  },
  {
    id: 'medium',
    label: 'Medium',
    emoji: '🕵️',
    desc: '4 suspects, 7 clues, 2 hints — a real detective challenge',
    color: 'border-amber-700/60 hover:border-amber-500',
    selectedColor: 'border-amber-500 bg-amber-900/20 ring-2 ring-amber-500/40',
  },
  {
    id: 'hard',
    label: 'Hard',
    emoji: '💀',
    desc: '5 suspects, 9 clues, 1 hint — only for the sharpest minds',
    color: 'border-red-700/60 hover:border-red-500',
    selectedColor: 'border-red-500 bg-red-900/20 ring-2 ring-red-500/40',
  },
]

const MIN_LENGTH = 20
const MAX_LENGTH = 500

export default function CreateMystery() {
  const navigate = useNavigate()
  const [premise, setPremise] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationMsg, setValidationMsg] = useState('')

  const handlePremiseChange = (e) => {
    const val = e.target.value
    if (val.length <= MAX_LENGTH) {
      setPremise(val)
    }
    // Clear validation on type
    if (validationMsg) setValidationMsg('')
  }

  const validate = () => {
    if (!premise.trim()) {
      setValidationMsg('Please enter a premise for your mystery.')
      return false
    }
    if (premise.trim().length < MIN_LENGTH) {
      setValidationMsg(`Premise must be at least ${MIN_LENGTH} characters. Add more detail!`)
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError(null)
    try {
      const data = await createCase(premise.trim(), difficulty)
      const caseId = data?.case?.id || data?.case?._id || data?.id || data?._id
      if (!caseId) throw new Error('Invalid response from server.')
      navigate(`/case/${caseId}`)
    } catch (err) {
      setError(err.message || 'Mystery generation is temporarily unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const charCount = premise.length
  const charColor =
    charCount < MIN_LENGTH
      ? 'text-red-400'
      : charCount > MAX_LENGTH * 0.9
        ? 'text-amber-400'
        : 'text-slate-500'

  return (
    <div className="page-enter min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🕵️</div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Create Your Mystery</h1>
          <p className="text-slate-400">
            Describe any premise and Gemini AI will craft a fully solvable detective mystery.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Premise */}
          <div className="mystery-card mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Mystery Premise <span className="text-amber-500">*</span>
            </label>
            <p className="text-slate-500 text-xs mb-3">
              Describe the setting, any characters, or the crime. Be as creative as you like!
            </p>
            <textarea
              className="input-field"
              rows={6}
              placeholder="e.g. A famous painting has gone missing from a private gallery during an exclusive dinner party. Six guests were present — none left the building. The host is desperate to recover it before the press finds out..."
              value={premise}
              onChange={handlePremiseChange}
              disabled={loading}
              maxLength={MAX_LENGTH}
            />
            <div className="flex items-center justify-between mt-2">
              {validationMsg ? (
                <p className="text-red-400 text-xs">{validationMsg}</p>
              ) : (
                <p className="text-slate-600 text-xs">
                  Minimum {MIN_LENGTH} characters required
                </p>
              )}
              <span className={`text-xs font-mono ${charColor}`}>
                {charCount}/{MAX_LENGTH}
              </span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="mystery-card mb-8">
            <label className="block text-sm font-semibold text-slate-300 mb-4">
              Difficulty Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DIFFICULTIES.map((d) => {
                const isSelected = difficulty === d.id
                return (
                  <button
                    key={d.id}
                    type="button"
                    disabled={loading}
                    onClick={() => setDifficulty(d.id)}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                      isSelected ? d.selectedColor : `bg-slate-900 ${d.color}`
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="text-2xl mb-1">{d.emoji}</div>
                    <div className="font-semibold text-slate-100 text-sm mb-1">{d.label}</div>
                    <div className="text-slate-400 text-xs leading-snug">{d.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Error */}
          {error && !loading && (
            <div className="mb-6 bg-red-900/20 border border-red-700/50 rounded-xl px-5 py-4 flex items-start gap-3">
              <span className="text-red-400 text-xl shrink-0">⚠️</span>
              <div>
                <p className="text-red-300 font-medium text-sm mb-1">Generation failed</p>
                <p className="text-red-400/80 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Loading state message */}
          {loading && (
            <div className="mb-6 bg-amber-900/10 border border-amber-700/30 rounded-xl px-5 py-4 flex items-start gap-3">
              <span className="text-amber-400 text-xl shrink-0 animate-pulse">✨</span>
              <div>
                <p className="text-amber-300 font-medium text-sm mb-1">Generating your mystery…</p>
                <p className="text-slate-400 text-sm">
                  Gemini AI is crafting suspects, clues, and the full story. This may take
                  10–30 seconds. Please wait…
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={loading}
            className="w-full shadow-lg shadow-amber-500/20"
          >
            {loading ? 'Generating Mystery…' : '🔍 Generate Mystery'}
          </Button>

          <p className="text-center text-slate-600 text-xs mt-4">
            Generation may take up to 30 seconds
          </p>
        </form>
      </div>
    </div>
  )
}
