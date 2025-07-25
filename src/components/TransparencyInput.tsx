import React from 'react';
import { TransparencyInputProps } from '../types';
import { alphaToPercentage, percentageToAlpha } from '../utils/colorUtils';

export const TransparencyInput: React.FC<TransparencyInputProps> = ({
  label,
  value,
  onChange,
  disabled = false
}) => {
  const percentage = alphaToPercentage(value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = parseInt(e.target.value);
    const newAlpha = percentageToAlpha(newPercentage);
    onChange(newAlpha);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace('%', '');
    const newPercentage = Math.max(0, Math.min(100, parseInt(inputValue) || 0));
    const newAlpha = percentageToAlpha(newPercentage);
    onChange(newAlpha);
  };

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-medium ${disabled ? 'text-slate-500' : 'text-slate-300'}`}>
        {label}
      </label>
      
      <div className="flex items-center gap-3">
        {/* Slider */}
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={percentage}
            onChange={handleSliderChange}
            disabled={disabled}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer
              ${disabled 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-white/20 hover:bg-white/30'
              }
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-blue-500
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:transition-all
              ${!disabled && '[&::-webkit-slider-thumb]:hover:bg-blue-400 [&::-webkit-slider-thumb]:hover:scale-110'}
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-blue-500
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:border-none
              [&::-moz-range-thumb]:shadow-lg
            `}
            style={{
              background: disabled 
                ? '#4B5563' 
                : `linear-gradient(to right, 
                    rgba(255,255,255,0.1) 0%, 
                    rgba(255,255,255,0.1) ${percentage}%, 
                    rgba(255,255,255,0.05) ${percentage}%, 
                    rgba(255,255,255,0.05) 100%)`
            }}
          />
        </div>

        {/* Input */}
        <div className="w-20">
          <input
            type="text"
            value={`${percentage}%`}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-full px-2 py-1 bg-white/5 border rounded-lg text-white text-sm text-center focus:outline-none focus:ring-2 transition-colors ${
              disabled 
                ? 'cursor-not-allowed opacity-50 border-white/10'
                : 'border-white/20 focus:ring-blue-500 hover:border-white/30'
            }`}
            placeholder="100%"
          />
        </div>
      </div>

      {/* Visual indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <div 
          className="w-4 h-4 rounded border border-white/20"
          style={{
            background: `rgba(255, 255, 255, ${value / 255})`,
            backdropFilter: 'blur(1px)'
          }}
        />
        <span>
          {percentage}% opacity ({value}/255)
        </span>
      </div>
    </div>
  );
}; 