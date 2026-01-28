export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number; // Alpha value 0-255
}

export interface GradientChar {
  char: string;
  color: string; // Now includes alpha: RRGGBBAA
}

export interface GradientPreset {
  name: string;
  colors: string[];
  category?: 'warm' | 'cool' | 'neutral' | 'special' | 'quirky' | 'brand' | 'trendy' | 'food' | 'countries';
  interpolation?: 'smooth' | 'discrete';
}

export interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  id: string;
  hoverColor?: string;
  disabled?: boolean;
}

export interface TransparencyInputProps {
  label: string;
  value: number; // 0-255
  onChange: (alpha: number) => void;
  disabled?: boolean;
}

export interface AppState {
  text: string;
  startColor: string;
  endColor: string;
  copied: boolean;
}

export interface TextSegment {
  content: string;
  isIcon: boolean;
} 