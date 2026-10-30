// client/src/components/layout/AppLayout.jsx
import React from 'react';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';

export const AppLayout = ({ children, hideFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-noir-950 text-noir-100">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};
