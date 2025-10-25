import React from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20 ${className}`}>
    {children}
  </div>
);

export default Card;
