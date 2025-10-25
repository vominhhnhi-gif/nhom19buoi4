import React from 'react';
import clsx from 'clsx';

const Input = ({ className, ariaInvalid, ...props }) => (
  <input
    {...props}
    aria-invalid={ariaInvalid}
    className={clsx('w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-150 text-gray-900 placeholder-gray-400', className)}
  />
);

export default Input;
