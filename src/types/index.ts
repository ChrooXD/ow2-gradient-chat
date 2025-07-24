export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface GradientChar {
  char: string;
  color: string;
}

export interface GradientPreset {
  name: string;
  colors: string[];
  category?: 'warm' | 'cool' | 'neutral' | 'special' | 'quirky';
}

export interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  id: string;
  hoverColor: string;
}

export interface AppState {
  text: string;
  startColor: string;
  endColor: string;
  copied: boolean;
} 