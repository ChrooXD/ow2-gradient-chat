import React from 'react';
import { GradientPreset } from '../types';
import { GRADIENT_PRESETS } from '../constants/gradients';

interface PresetButtonsProps {
  onPresetSelect: (preset: GradientPreset) => void;
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({ onPresetSelect }) => {
  const groupedPresets = GRADIENT_PRESETS.reduce((acc, preset) => {
    const category = preset.category || 'neutral';
    if (!acc[category]) acc[category] = [];
    acc[category].push(preset);
    return acc;
  }, {} as Record<string, GradientPreset[]>);

  const categoryColors = {
    warm: 'hover:bg-orange-500/20 border-orange-500/30',
    cool: 'hover:bg-blue-500/20 border-blue-500/30',
    neutral: 'hover:bg-gray-500/20 border-gray-500/30',
    special: 'hover:bg-purple-500/20 border-purple-500/30',
    quirky: 'hover:bg-pink-500/20 border-pink-500/30'
  };

  const renderColorPreview = (colors: string[]) => {
    if (colors.length <= 2) {
      // For 2 colors, show side by side
      return (
        <div className="flex h-2 w-4 rounded-sm overflow-hidden">
          <div 
            className="w-2 h-full" 
            style={{ backgroundColor: colors[0] }}
          />
          <div 
            className="w-2 h-full" 
            style={{ backgroundColor: colors[colors.length - 1] }}
          />
        </div>
      );
    } else {
      // For 3+ colors, show all colors in segments
      const segmentWidth = 16 / colors.length;
      return (
        <div className="flex h-2 w-4 rounded-sm overflow-hidden">
          {colors.map((color, index) => (
            <div 
              key={index}
              className="h-full" 
              style={{ 
                backgroundColor: color,
                width: `${segmentWidth}px`,
                minWidth: '2px'
              }}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-slate-300 mb-3">
        Quick Presets
      </label>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {Object.entries(groupedPresets).map(([category, presets]) => (
          <div key={category} className="space-y-1">
            <h4 className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              {category}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onPresetSelect(preset)}
                  className={`px-2 py-1.5 bg-white/5 border border-white/20 rounded-lg text-xs text-white transition-all duration-200 hover:scale-105 ${
                    categoryColors[category as keyof typeof categoryColors]
                  }`}
                  aria-label={`Apply ${preset.name} gradient preset with ${preset.colors.length} colors`}
                  title={`${preset.name}: ${preset.colors.join(' → ')}`}
                >
                  <div className="flex items-center gap-1">
                    {renderColorPreview(preset.colors)}
                    <span className="truncate">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 