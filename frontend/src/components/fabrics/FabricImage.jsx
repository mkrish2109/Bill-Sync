import React from 'react';

export const FabricImage = ({ imageUrl, name, className = '' }) => (
  <div className="relative aspect-square w-full max-w-md mx-auto">
    <img 
      src={imageUrl} 
      alt={name} 
      className={`w-full h-full object-contain p-2 sm:p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
      onError={(e) => {
        e.target.onerror = null; 
        e.target.src = '/images/placeholder-fabric.jpg';
      }}
    />
  </div>
);