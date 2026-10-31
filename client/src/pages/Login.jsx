import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!emailOrUsername.trim() || !password) {
      setError('Please provide both your email/username and password.')
      return
    }

    try {
      setLoading(true)
      await login(emailOrUsername.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-3xl mb-4">
            🕵️
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-100 tracking-wide">
            Detective Headquarters
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your case files and track investigation stats.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-xl text-red-200 text-sm flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Username or Email
              </label>
              <input
                type="text"
                autoComplete="username"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="detective_holmes or email@domain.com"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              className="w-full py-3"
            >
              Sign In to Casebook
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-800 flex flex-col items-center gap-3 text-sm text-slate-400">
          <div>
            New to the bureau?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4">
              Enlist as Detective
            </Link>
          </div>
          <div>
            <Link to="/create" className="text-slate-500 hover:text-slate-300 text-xs transition">
              Play anonymously as Guest →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

