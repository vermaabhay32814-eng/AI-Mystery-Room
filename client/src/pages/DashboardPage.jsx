// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Plus, Trash2, ArrowRight, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { caseService } from '../services/case.service.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton.jsx';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await caseService.getCases();
      if (res.success && res.data?.cases) {
        setCases(res.data.cases);
      }
    } catch (err) {
      setError(err.message || 'Failed to load case files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleDelete = async (caseId) => {
    if (!window.confirm('Are you sure you want to permanently delete this case file?')) return;
    try {
      setDeletingId(caseId);
      await caseService.deleteCase(caseId);
      setCases((prev) => prev.filter((c) => c._id !== caseId));
    } catch (err) {
      alert(`Failed to delete case: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="emerald">SOLVED</Badge>;
      case 'ready':
      case 'in_progress':
        return <Badge variant="amber">OPEN INVESTIGATION</Badge>;
      case 'generating':
        return <Badge variant="blue">GENERATING BLUEPRINT...</Badge>;
      case 'failed':
      default:
        return <Badge variant="red">FAILED</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-noir-800">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
            Department Case Files
          </span>
          <h1 className="text-3xl font-bold font-cinzel text-white">
            Welcome, Inspector {user?.name || 'Detective'}
          </h1>
          <p className="text-xs text-noir-400 mt-1">
            Review your active dockets, resume unfinished forensic inquiries, or commission a new mystery.
          </p>
        </div>

        <Link to="/create">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Generate New Case</span>
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Case Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton className="h-48" count={6} />
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-noir-900 border border-dashed border-noir-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-noir-950 border border-noir-700/60 flex items-center justify-center text-noir-400 mx-auto">
            <Compass className="w-8 h-8 text-emerald-500/60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-cinzel text-white">No Active Inquiries</h3>
            <p className="text-xs text-noir-400 max-w-sm mx-auto">
              You haven't commissioned any mysteries yet. Enter a story prompt to unleash Gemini's mystery generator.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/create">
              <Button variant="primary" size="md">
                Create First Mystery
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <div
              key={caseItem._id}
              className="bg-noir-900 border border-noir-800/80 rounded-2xl p-6 shadow-xl hover:border-noir-700 hover:bg-noir-850/60 transition flex flex-col justify-between gap-5 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getStatusBadge(caseItem.status)}
                  <span className="text-[10px] font-mono text-noir-400 uppercase">
                    {caseItem.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-cinzel group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {caseItem.title}
                </h3>
                <p className="text-xs text-noir-300 mt-2 line-clamp-3 leading-relaxed">
                  "{caseItem.originalScenario}"
                </p>
              </div>

              <div className="pt-4 border-t border-noir-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-noir-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(caseItem.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(caseItem._id)}
                    disabled={deletingId === caseItem._id}
                    title="Delete case file"
                    className="p-2 text-noir-400 hover:text-red-400 hover:bg-noir-800/80 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link to={`/investigation/${caseItem._id}`}>
                    <Button variant="secondary" size="sm">
                      <span>Investigate</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

