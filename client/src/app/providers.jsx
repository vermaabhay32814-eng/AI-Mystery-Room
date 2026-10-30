// client/src/app/providers.jsx
import React from 'react';
import { AuthProvider } from '../context/AuthContext.jsx';

export const Providers = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

