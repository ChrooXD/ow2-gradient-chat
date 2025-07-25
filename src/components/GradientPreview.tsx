import React from 'react';
import { GradientChar } from '../types';

interface GradientPreviewProps {
  gradientData: GradientChar[];
  text: string;
  outputFormat?: 'gradient' | 'solid';
  startColor?: string;
}

export const GradientPreview: React.FC<GradientPreviewProps> = ({
  gradientData,
  text,
  outputFormat = 'gradient',
  startColor = '#FFFFFF'
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Preview
      </h2>
      <div 
        className="bg-black/30 rounded-xl p-6 min-h-[80px] flex items-center justify-center"
        role="img"
        aria-label={text ? `${outputFormat} preview of: ${text}` : 'Preview area'}
      >
        {text ? (
          <div 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider break-all text-center leading-relaxed"
            style={{ wordBreak: 'break-word' }}
          >
            {outputFormat === 'solid' ? (
              <span style={{ color: startColor }}>
                {text}
              </span>
            ) : (
              gradientData.map((item, index) => (
                <span 
                  key={index} 
                  style={{ color: `#${item.color}` }}
                  className="inline-block"
                >
                  {item.char === ' ' ? '\u00A0' : item.char}
                </span>
              ))
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-lg text-center">
            Enter text to see preview
          </p>
        )}
      </div>
      {text && (
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">
            {outputFormat === 'solid' 
              ? `Single color applied to all ${text.length} character${text.length !== 1 ? 's' : ''}`
              : `Colors transition from your start color to end color across ${text.length} character${text.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
      )}
    </div>
  );
}; 