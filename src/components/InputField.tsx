'use client';

import React from 'react';

interface InputFieldProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
}

export default function InputField({
  type = 'text',
  placeholder = 'Ask me anything...',
  value,
  onChange,
  className = '',
  disabled = false,
  name,
}: InputFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
      className={`
        rounded-full
        px-6
        py-4
        text-primary
        bg-custom-gray
        shadow-lg
        w-2/3
        hover:shadow-xl
        focus:shadow-xl
        focus:outline-none
        transition-all
        duration-300
        disabled:bg-gray-100
        disabled:cursor-not-allowed
        disabled:shadow-md
        ${className}
      `}
    />
  );
}
