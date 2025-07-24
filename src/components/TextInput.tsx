import React from 'react';
import { MAX_TEXT_LENGTH } from '../constants/gradients';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = "Type your text here..."
}) => {
  const isAtLimit = value.length >= MAX_TEXT_LENGTH;
  const isNearLimit = value.length >= MAX_TEXT_LENGTH * 0.8;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_TEXT_LENGTH) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label 
          htmlFor="text-input"
          className="block text-sm font-medium text-slate-300"
        >
          Enter Your Text
        </label>
        <span 
          className={`text-xs ${
            isAtLimit 
              ? 'text-red-400' 
              : isNearLimit 
                ? 'text-yellow-400' 
                : 'text-slate-400'
          }`}
          aria-live="polite"
        >
          {value.length}/{MAX_TEXT_LENGTH}
        </span>
      </div>
      <input
        id="text-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
          isAtLimit 
            ? 'border-red-400 focus:ring-red-500' 
            : 'border-white/20 focus:ring-blue-500'
        }`}
        aria-describedby="char-count"
        maxLength={MAX_TEXT_LENGTH}
      />
      {isNearLimit && (
        <p 
          id="char-count"
          className={`text-xs ${isAtLimit ? 'text-red-400' : 'text-yellow-400'}`}
          role="status"
        >
          {isAtLimit 
            ? 'Character limit reached' 
            : `Approaching character limit (${MAX_TEXT_LENGTH - value.length} remaining)`
          }
        </p>
      )}
    </div>
  );
}; 