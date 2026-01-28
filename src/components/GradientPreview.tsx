import React from 'react';
import { GradientChar } from '../types';
import { getIconImagePath } from '../utils/colorUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GradientPreviewProps {
  gradientData: GradientChar[];
  text: string;
  outputFormat?: 'gradient' | 'solid';
  startColor?: string;
  startAlpha?: number;
}

// Icon display component for preview
const PreviewIcon: React.FC<{ iconCode: string }> = ({ iconCode }) => {
  const imagePath = getIconImagePath(iconCode);

  return (
    <img
      src={imagePath}
      alt={`Icon ${iconCode}`}
      className="inline-block w-8 h-8 mx-1 align-middle object-contain"
      onError={(e) => {
        const target = e.target as HTMLElement;
        target.style.display = 'none';
        const fallback = target.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = 'inline';
      }}
    />
  );
};

// Check if a string is an icon code
const isIconCode = (str: string): boolean => {
  return /^<TX[C]?[0-9A-Fa-f]+>$/i.test(str);
};

export const GradientPreview: React.FC<GradientPreviewProps> = ({
  gradientData,
  text,
  outputFormat = 'gradient',
  startColor = '#FFFFFF',
  startAlpha = 255
}) => {
  // Convert hex color with alpha to rgba format for CSS
  const hexToRgba = (hexColor: string): string => {
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

  // Parse text with icons for solid color mode
  const parseTextForSolidPreview = (inputText: string) => {
    const iconRegex = /<TX[C]?[0-9A-Fa-f]+>/gi;
    const parts: Array<{ content: string; isIcon: boolean }> = [];
    let lastIndex = 0;
    let match;

    while ((match = iconRegex.exec(inputText)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = inputText.substring(lastIndex, match.index);
        if (textBefore.length > 0) {
          parts.push({ content: textBefore, isIcon: false });
        }
      }

      parts.push({ content: match[0], isIcon: true });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < inputText.length) {
      const remainingText = inputText.substring(lastIndex);
      if (remainingText.length > 0) {
        parts.push({ content: remainingText, isIcon: false });
      }
    }

    return parts;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
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
                parseTextForSolidPreview(text).map((part, index) =>
                  part.isIcon ? (
                    <span key={index} className="inline-block">
                      <PreviewIcon iconCode={part.content} />
                      <span style={{ display: 'none', color: colorWithAlpha(startColor, startAlpha) }}>
                        {part.content}
                      </span>
                    </span>
                  ) : (
                    <span key={index} style={{ color: colorWithAlpha(startColor, startAlpha) }}>
                      {part.content}
                    </span>
                  )
                )
              ) : (
                gradientData.map((item, index) =>
                  isIconCode(item.char) ? (
                    <span key={index} className="inline-block">
                      <PreviewIcon iconCode={item.char} />
                      <span style={{ display: 'none', color: hexToRgba(item.color) }}>
                        {item.char}
                      </span>
                    </span>
                  ) : (
                    <span
                      key={index}
                      style={{ color: hexToRgba(item.color) }}
                      className="inline-block"
                    >
                      {item.char === ' ' ? '\u00A0' : item.char}
                    </span>
                  )
                )
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-lg text-center relative z-10">
              Enter text to see preview
            </p>
          )}
        </div>
        {text && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              {outputFormat === 'solid'
                ? `Single color with ${Math.round((startAlpha / 255) * 100)}% opacity applied to all ${text.length} character${text.length !== 1 ? 's' : ''}`
                : `Colors transition from your start color to end color across ${text.length} character${text.length !== 1 ? 's' : ''} with transparency`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
