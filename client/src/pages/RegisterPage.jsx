// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/Button.jsx';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-noir-900 border border-noir-800 rounded-3xl p-8 shadow-2xl space-y-6 relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold font-cinzel text-white">Join the Bureau</h2>
          <p className="text-xs text-noir-400">Create your detective profile to persist cases and track solve rates.</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
          <div className="space-y-1">
            <label className="text-noir-300 font-mono uppercase text-[11px] block">Detective Name / Alias</label>
            <div className="relative">
              <User className="w-4 h-4 text-noir-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Detective Vance"
                className="w-full bg-noir-950 border border-noir-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-noir-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-noir-300 font-mono uppercase text-[11px] block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-noir-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vance@agency.com"
                className="w-full bg-noir-950 border border-noir-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-noir-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-noir-300 font-mono uppercase text-[11px] block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-noir-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-noir-950 border border-noir-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-noir-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-noir-300 font-mono uppercase text-[11px] block">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-noir-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-noir-950 border border-noir-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-noir-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full mt-3" isLoading={isLoading}>
            <span>Create Profile</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-noir-800 text-xs text-noir-400">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-medium">
            Sign in to your bureau
          </Link>
        </div>
      </div>
    </div>
  );
};
