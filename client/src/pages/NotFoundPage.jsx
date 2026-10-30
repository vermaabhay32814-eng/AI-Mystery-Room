// client/src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-noir-900 border border-noir-800 rounded-3xl p-8 space-y-4 shadow-2xl">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold font-cinzel text-white">404 — Cold Case</h2>
        <p className="text-xs text-noir-400">
          The dossier or room you are attempting to access does not exist in our department archives.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="secondary" size="md">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Safety
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

