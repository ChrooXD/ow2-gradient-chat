import React, { useRef } from 'react';
import { ColorInputProps } from '../types';
import { isValidHexColor } from '../utils/colorUtils';

export const ColorPicker: React.FC<ColorInputProps> = ({
  label,
  value,
  onChange,
  id,
  hoverColor
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleColorBoxClick = () => {
    colorInputRef.current?.click();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.startsWith('#') || newValue === '') {
      onChange(newValue);
    } else {
      onChange(`#${newValue}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleColorBoxClick();
    }
  };

  const isValid = isValidHexColor(value);

  return (
    <div className="space-y-3">
      <label 
        htmlFor={`${id}-text`}
        className="block text-sm font-medium text-slate-300"
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div 
          className="relative"
          role="button"
          tabIndex={0}
          aria-label={`${label} color picker`}
          onKeyDown={handleKeyDown}
        >
          <input
            ref={colorInputRef}
            type="color"
            value={isValid ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-20 h-20 opacity-0 cursor-pointer"
            id={id}
            aria-label={`${label} color input`}
          />
          <div
            className={`w-20 h-20 rounded-xl border-3 cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg ${
              isValid 
                ? `border-white/40 hover:${hoverColor}` 
                : 'border-red-400 hover:border-red-300'
            }`}
            style={{ backgroundColor: isValid ? value : '#ff0000' }}
            onClick={handleColorBoxClick}
            role="button"
            tabIndex={-1}
            aria-hidden="true"
          />
          {!isValid && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={handleTextChange}
            className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 transition-colors ${
              isValid 
                ? 'border-white/20 focus:ring-blue-500' 
                : 'border-red-400 focus:ring-red-500'
            }`}
            id={`${id}-text`}
            aria-describedby={!isValid ? `${id}-error` : undefined}
            placeholder="#FFFFFF"
          />
          {!isValid && (
            <p 
              id={`${id}-error`}
              className="text-red-400 text-xs mt-1"
              role="alert"
            >
              Invalid hex color format
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 