import React from 'react';
import clsx from 'clsx';

const VARIANT_CLASSES = {
  primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-50'
};

const Button = ({ children, className, variant = 'primary', ...props }) => {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-150',
        VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
