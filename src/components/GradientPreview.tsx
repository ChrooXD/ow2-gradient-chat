import React from 'react';
import { GradientChar } from '../types';

interface GradientPreviewProps {
  gradientData: GradientChar[];
  text: string;
  outputFormat?: 'gradient' | 'solid';
  startColor?: string;
  startAlpha?: number;
}

export const GradientPreview: React.FC<GradientPreviewProps> = ({
  gradientData,
  text,
  outputFormat = 'gradient',
  startColor = '#FFFFFF',
  startAlpha = 255
}) => {
  // Convert hex color with alpha to rgba format for CSS
  const hexToRgba = (hexColor: string): string => {
    // Handle both RRGGBB and RRGGBBAA formats
    if (hexColor.length === 8) {
      const r = parseInt(hexColor.substring(0, 2), 16);
      const g = parseInt(hexColor.substring(2, 4), 16);
      const b = parseInt(hexColor.substring(4, 6), 16);
      const a = parseInt(hexColor.substring(6, 8), 16) / 255;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else if (hexColor.length === 6) {
      const r = parseInt(hexColor.substring(0, 2), 16);
      const g = parseInt(hexColor.substring(2, 4), 16);
      const b = parseInt(hexColor.substring(4, 6), 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return 'rgb(255, 255, 255)';
  };

  // Convert hex color (with #) and alpha to rgba
  const colorWithAlpha = (hex: string, alpha: number): string => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const a = alpha / 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Preview
      </h2>
      <div 
        className="bg-black/30 rounded-xl p-6 min-h-[80px] flex items-center justify-center relative overflow-hidden"
        role="img"
        aria-label={text ? `${outputFormat} preview of: ${text}` : 'Preview area'}
      >
        {/* Checkered background for transparency visualization */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #666 25%, transparent 25%),
              linear-gradient(-45deg, #666 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #666 75%),
              linear-gradient(-45deg, transparent 75%, #666 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />
        
        {text ? (
          <div 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider break-all text-center leading-relaxed relative z-10"
            style={{ wordBreak: 'break-word' }}
          >
            {outputFormat === 'solid' ? (
              <span style={{ color: colorWithAlpha(startColor, startAlpha) }}>
                {text}
              </span>
            ) : (
              gradientData.map((item, index) => (
                <span 
                  key={index} 
                  style={{ color: hexToRgba(item.color) }}
                  className="inline-block"
                >
                  {item.char === ' ' ? '\u00A0' : item.char}
                </span>
              ))
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-lg text-center relative z-10">
            Enter text to see preview
          </p>
        )}
      </div>
      {text && (
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">
            {outputFormat === 'solid' 
              ? `Single color with ${Math.round((startAlpha / 255) * 100)}% opacity applied to all ${text.length} character${text.length !== 1 ? 's' : ''}`
              : `Colors transition from your start color to end color across ${text.length} character${text.length !== 1 ? 's' : ''} with transparency`
            }
          </p>
        </div>
      )}
    </div>
  );
}; 