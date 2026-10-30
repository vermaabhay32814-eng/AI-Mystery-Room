// client/src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Compass, PlusCircle, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../ui/Button.jsx';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-noir-800/80 bg-noir-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-cinzel font-bold text-lg tracking-wider text-white group-hover:text-emerald-400 transition-colors">
              AI MYSTERY ROOM
            </span>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-noir-400 -mt-1">
              Detective Suite
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-3">
          <Link
            to="/create"
            className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg hover:bg-emerald-950/30 transition border border-emerald-800/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Mystery</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-noir-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-noir-800 transition"
              >
                <Compass className="w-4 h-4" />
                <span>My Cases</span>
              </Link>

              <div className="flex items-center gap-3 pl-2 border-l border-noir-800">
                <span className="text-xs text-noir-300 font-mono hidden sm:inline-block">
                  Det. {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-noir-400 hover:text-red-400 hover:bg-noir-800/80 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

