// client/src/app/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { Providers } from './providers.jsx';

export const App = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
};
