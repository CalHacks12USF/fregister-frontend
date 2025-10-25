'use client';

import React from 'react';

interface InputFieldProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
}

export default function InputField({
  type = 'text',
  placeholder = 'Ask me anything...',
  value,
  onChange,
  onKeyDown,
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
      onKeyDown={onKeyDown}
      disabled={disabled}
      name={name}
      className={`
        rounded-full
        px-6
        py-4
        text-primary
        bg-custom-gray
        shadow-lg
        w-full
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
