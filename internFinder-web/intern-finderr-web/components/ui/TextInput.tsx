import React from 'react';

interface TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  className?: string;
  [key: string]: any;
}

export function TextInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  className = '',
  ...props
}: TextInputProps) {
  const getInputType = () => {
    if (secureTextEntry) return 'password';
    if (keyboardType === 'email-address') return 'email';
    return 'text';
  };

  return (
    <input
      type={getInputType()}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeText?.(e.target.value)}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
      className={`text-input ${className}`}
      {...props}
    />
  );
} 