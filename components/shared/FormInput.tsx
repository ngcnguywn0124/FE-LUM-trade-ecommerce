'use client';

import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 transition-all
            focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
            placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400
            ${error ? 'border-red-500 focus:ring-red-400' : ''} 
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
