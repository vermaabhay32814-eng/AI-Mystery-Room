// client/src/components/ui/Card.jsx
import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-noir-900/90 border border-noir-800/80 rounded-xl p-5 shadow-xl shadow-black/40 backdrop-blur-sm ${
        hover ? 'transition-all duration-200 hover:border-noir-700 hover:bg-noir-850 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
