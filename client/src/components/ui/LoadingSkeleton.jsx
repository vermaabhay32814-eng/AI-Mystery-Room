// client/src/components/ui/LoadingSkeleton.jsx
import React from 'react';

export const LoadingSkeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-noir-800/80 rounded-lg ${className}`}
        />
      ))}
    </>
  );
};

