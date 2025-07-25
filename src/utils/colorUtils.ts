import { RGB, RGBA, GradientChar, TextSegment } from '../types';

/**
 * Validates if a string is a valid hex color
 */
export const isValidHexColor = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

/**
 * Convert hex color to RGB values
 */
export const hexToRgb = (hex: string): RGB => {
  const cleanHex = hex.replace('#', '');
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  
  if (!result) {
    console.warn(`Invalid hex color: ${hex}`);
    return { r: 0, g: 0, b: 0 };
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
};

/**
 * Convert hex color to RGBA values
 */
export const hexToRgba = (hex: string, alpha: number = 255): RGBA => {
  const rgb = hexToRgb(hex);
  return {
    ...rgb,
    a: Math.max(0, Math.min(255, Math.round(alpha)))
  };
};

/**
 * Convert RGB values to hex color
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number): string => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };
  
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Convert RGB to HSL
 */
export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Convert HSL to RGB
 */
export const hslToRgb = (h: number, s: number, l: number): RGB => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

/**
 * Convert RGBA values to hex color with alpha
 */
export const rgbaToHex = (r: number, g: number, b: number, a: number): string => {
  const toHex = (n: number): string => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };
  
  return `${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
};

/**
 * Convert alpha value (0-255) to percentage (0-100)
 */
export const alphaToPercentage = (alpha: number): number => {
  return Math.round((alpha / 255) * 100);
};

/**
 * Convert percentage (0-100) to alpha value (0-255)
 */
export const percentageToAlpha = (percentage: number): number => {
  return Math.round((percentage / 100) * 255);
};

/**
 * Generate gradient with multiple color stops
 */
export const generateMultiColorGradient = (
  text: string,
  colors: string[],
  startAlpha: number = 255,
  endAlpha: number = 255
): GradientChar[] => {
  if (!text || text.length === 0) return [];
  if (colors.length < 2) return [];
  
  // Validate all colors
  const validColors = colors.filter(isValidHexColor);
  if (validColors.length < 2) {
    console.warn('Not enough valid colors provided');
    return text.split('').map(char => ({ char, color: '000000FF' }));
  }
  
  const length = text.length;
  if (length === 1) {
    const rgba = hexToRgba(validColors[0], startAlpha);
    return [{ char: text[0], color: rgbaToHex(rgba.r, rgba.g, rgba.b, rgba.a) }];
  }

  return text.split('').map((char, index) => {
    const ratio = index / (length - 1);
    
    // Calculate which color segment we're in
    const segmentSize = 1 / (validColors.length - 1);
    const segmentIndex = Math.min(
      Math.floor(ratio / segmentSize),
      validColors.length - 2
    );
    
    // Calculate position within the segment (0-1)
    const segmentRatio = (ratio - segmentIndex * segmentSize) / segmentSize;
    
    // Get the two colors to interpolate between
    const startColor = hexToRgb(validColors[segmentIndex]);
    const endColor = hexToRgb(validColors[segmentIndex + 1]);
    
    // Convert to HSL for better perceptual interpolation
    const startHsl = rgbToHsl(startColor.r, startColor.g, startColor.b);
    const endHsl = rgbToHsl(endColor.r, endColor.g, endColor.b);
    
    // Handle hue wraparound for shorter path
    let hueDiff = endHsl.h - startHsl.h;
    if (Math.abs(hueDiff) > 180) {
      if (hueDiff > 0) {
        hueDiff -= 360;
      } else {
        hueDiff += 360;
      }
    }
    
    // Interpolate in HSL space
    const h = startHsl.h + hueDiff * segmentRatio;
    const s = startHsl.s + (endHsl.s - startHsl.s) * segmentRatio;
    const l = startHsl.l + (endHsl.l - startHsl.l) * segmentRatio;
    
    // Convert back to RGB
    const { r, g, b } = hslToRgb(h, s, l);
    
    // Interpolate alpha
    const alpha = startAlpha + (endAlpha - startAlpha) * ratio;
    
    return {
      char,
      color: rgbaToHex(r, g, b, alpha)
    };
  });
};

/**
 * Generate gradient colors for text (backward compatible)
 */
export const generateGradient = (
  text: string, 
  startColor: string, 
  endColor: string,
  startAlpha: number = 255,
  endAlpha: number = 255
): GradientChar[] => {
  return generateMultiColorGradient(text, [startColor, endColor], startAlpha, endAlpha);
};

/**
 * Calculate contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};



/**
 * Parse text and separate icon codes from regular text
 */
export const parseTextWithIcons = (text: string): TextSegment[] => {
  if (!text) return [];
  
  // Regular expression to match Overwatch icon codes: <TX[C]?[0-9A-Fa-f]+>
  const iconRegex = /<TX[C]?[0-9A-Fa-f]+>/gi;
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  let match;

  while ((match = iconRegex.exec(text)) !== null) {
    // Add text before the icon (if any)
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore.length > 0) {
        segments.push({ content: textBefore, isIcon: false });
      }
    }
    
    // Add the icon
    segments.push({ content: match[0], isIcon: true });
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text after the last icon
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText.length > 0) {
      segments.push({ content: remainingText, isIcon: false });
    }
  }
  
  return segments;
};

/**
 * Generate gradient for text with icons, preserving icon codes
 */
export const generateGradientWithIcons = (
  text: string,
  colors: string[],
  startAlpha: number = 255,
  endAlpha: number = 255
): GradientChar[] => {
  const segments = parseTextWithIcons(text);
  const result: GradientChar[] = [];
  
  // First, collect all non-icon text to calculate gradient positions
  const nonIconSegments = segments.filter(segment => !segment.isIcon);
  const totalNonIconLength = nonIconSegments.reduce((sum, segment) => sum + segment.content.length, 0);
  
  if (totalNonIconLength === 0) {
    // Only icons, no gradient needed
    return segments.map(segment => ({ char: segment.content, color: '' }));
  }
  
  let nonIconCharIndex = 0;
  
  for (const segment of segments) {
    if (segment.isIcon) {
      // Add icon as-is without any color formatting
      result.push({ char: segment.content, color: '' });
    } else {
      // Apply gradient to regular text
      const segmentGradient = segment.content.split('').map((char, localIndex) => {
        const globalIndex = nonIconCharIndex + localIndex;
        const ratio = totalNonIconLength === 1 ? 0 : globalIndex / (totalNonIconLength - 1);
        
        // Calculate which color segment we're in
        const segmentSize = 1 / (colors.length - 1);
        const segmentIndex = Math.min(
          Math.floor(ratio / segmentSize),
          colors.length - 2
        );
        
        // Calculate position within the segment (0-1)
        const segmentRatio = (ratio - segmentIndex * segmentSize) / segmentSize;
        
        // Get the two colors to interpolate between
        const startColor = hexToRgb(colors[segmentIndex]);
        const endColor = hexToRgb(colors[segmentIndex + 1]);
        
        // Convert to HSL for better perceptual interpolation
        const startHsl = rgbToHsl(startColor.r, startColor.g, startColor.b);
        const endHsl = rgbToHsl(endColor.r, endColor.g, endColor.b);
        
        // Handle hue wraparound for shorter path
        let hueDiff = endHsl.h - startHsl.h;
        if (Math.abs(hueDiff) > 180) {
          if (hueDiff > 0) {
            hueDiff -= 360;
          } else {
            hueDiff += 360;
          }
        }
        
        // Interpolate in HSL space
        const h = startHsl.h + hueDiff * segmentRatio;
        const s = startHsl.s + (endHsl.s - startHsl.s) * segmentRatio;
        const l = startHsl.l + (endHsl.l - startHsl.l) * segmentRatio;
        
        // Convert back to RGB
        const { r, g, b } = hslToRgb(h, s, l);
        
        // Interpolate alpha
        const alpha = startAlpha + (endAlpha - startAlpha) * ratio;
        
        return {
          char,
          color: rgbaToHex(r, g, b, alpha)
        };
      });
      
      result.push(...segmentGradient);
      nonIconCharIndex += segment.content.length;
    }
  }
  
  return result;
};

/**
 * Split formatted output into chunks of maximum 200 characters
 * Preserves color codes and icon codes, tries to split at word boundaries
 */
export const splitFormattedOutput = (formattedOutput: string, maxLength: number = 200): string[] => {
  if (!formattedOutput || formattedOutput.length <= maxLength) {
    return [formattedOutput];
  }

  const chunks: string[] = [];
  let currentChunk = '';
  let i = 0;

  while (i < formattedOutput.length && chunks.length < 4) {
    const remainingLength = maxLength - currentChunk.length;
    
    // If we're at the start of a color code or icon code, don't split it
    if (formattedOutput[i] === '<' && (
        formattedOutput.substring(i).match(/^<FG[0-9A-Fa-f]{8}>/) ||
        formattedOutput.substring(i).match(/^<TX[C]?[0-9A-Fa-f]+>/)
      )) {
      
      // Find the end of the code
      let codeEnd = formattedOutput.indexOf('>', i);
      if (codeEnd !== -1) {
        const code = formattedOutput.substring(i, codeEnd + 1);
        
        // If adding this code would exceed the limit, start a new chunk
        if (currentChunk.length + code.length > maxLength && currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = code;
        } else {
          currentChunk += code;
        }
        i = codeEnd + 1;
        continue;
      }
    }

    // If we have space for at least one more character
    if (remainingLength > 0) {
      currentChunk += formattedOutput[i];
      i++;
    } else {
      // Try to find a good breaking point (space or word boundary)
      let breakPoint = currentChunk.length;
      for (let j = currentChunk.length - 1; j >= Math.max(0, currentChunk.length - 20); j--) {
        if (currentChunk[j] === ' ') {
          breakPoint = j;
          break;
        }
      }
      
      // If we found a good break point, use it
      if (breakPoint < currentChunk.length && breakPoint > currentChunk.length * 0.8) {
        const splitChunk = currentChunk.substring(0, breakPoint);
        chunks.push(splitChunk);
        currentChunk = currentChunk.substring(breakPoint + 1); // Skip the space
      } else {
        // Otherwise, just split at the limit
        chunks.push(currentChunk);
        currentChunk = '';
      }
    }
  }

  // Add the remaining chunk if it has content
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}; 