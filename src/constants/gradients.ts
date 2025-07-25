import { GradientPreset } from '../types';

export const GRADIENT_PRESETS: GradientPreset[] = [
  // Warm (2-color)
  { name: 'Fire', colors: ['#FF4500', '#FFD700'], category: 'warm' },
  { name: 'Lava', colors: ['#FF0000', '#FF8C00'], category: 'warm' },
  { name: 'Gold Rush', colors: ['#FFD700', '#FFA500'], category: 'warm' },
  { name: 'Cherry', colors: ['#8B0000', '#FF1493'], category: 'warm' },
  { name: 'Copper', colors: ['#8B4513', '#FF8C00', '#228B22'], category: 'warm' },
  
  // Cool (2-color)
  { name: 'Ocean', colors: ['#006994', '#00D4FF'], category: 'cool' },
  { name: 'Ice Storm', colors: ['#00FFFF', '#87CEEB'], category: 'cool' },
  { name: 'Arctic', colors: ['#E0F6FF', '#87CEFA'], category: 'cool' },
  { name: 'Deep Sea', colors: ['#191970', '#008080', '#00CED1'], category: 'cool' },
  { name: 'Sapphire', colors: ['#003366', '#0066CC'], category: 'cool' },
  
  // Special (2-color)
  { name: 'Cyberpunk', colors: ['#FF0080', '#00FFFF'], category: 'special' },
  { name: 'Neon Glow', colors: ['#39FF14', '#00FFFF'], category: 'special' },
  { name: 'Matrix', colors: ['#00FF00', '#008000'], category: 'special' },
  { name: 'Synthwave', colors: ['#FF00FF', '#00FFFF'], category: 'special' },
  { name: 'Toxic', colors: ['#ADFF2F', '#32CD32'], category: 'special' },
  { name: 'Hologram', colors: ['#00FFFF', '#0080FF', '#8000FF'], category: 'special' },
  { name: 'Plasma', colors: ['#8A2BE2', '#FF1493', '#FFFFFF'], category: 'special' },
  { name: 'Lightning', colors: ['#FFFF00', '#FFFFFF', '#87CEEB'], category: 'special' },
  
  // Neutral (2-color)
  { name: 'Midnight', colors: ['#191970', '#9370DB'], category: 'neutral' },
  { name: 'Steel', colors: ['#708090', '#C0C0C0'], category: 'neutral' },
  { name: 'Ghost', colors: ['#F8F8FF', '#DCDCDC'], category: 'neutral' },
  { name: 'Storm', colors: ['#2F2F2F', '#663399', '#000000'], category: 'neutral' },
  { name: 'Sepia', colors: ['#8B4513', '#DEB887', '#F5DEB3'], category: 'neutral' },
  { name: 'Foggy', colors: ['#D3D3D3', '#FFFFFF', '#E0F6FF'], category: 'neutral' },
  
  // Quirky (3-4 colors)
  { name: 'Rainbow', colors: ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF'], category: 'quirky' },
  { name: 'Cotton Candy', colors: ['#FFB6C1', '#FF69B4', '#DA70D6'], category: 'quirky' },
  { name: 'Galaxy', colors: ['#4B0082', '#9400D3', '#FF1493', '#FFD700'], category: 'quirky' },
  { name: 'Tropical', colors: ['#FF6347', '#FFD700', '#ADFF2F'], category: 'quirky' },
  { name: 'Unicorn', colors: ['#FF69B4', '#DDA0DD', '#87CEEB', '#98FB98'], category: 'quirky' },
  { name: 'Sunset Strip', colors: ['#FF4500', '#FF6347', '#FFD700', '#FFA500'], category: 'quirky' },
  { name: 'Aurora', colors: ['#00FF7F', '#00FFFF', '#9370DB'], category: 'quirky' },
  { name: 'Cosmic', colors: ['#8A2BE2', '#FF1493', '#00BFFF'], category: 'quirky' },
  { name: 'Vaporwave', colors: ['#FF00FF', '#00FFFF', '#FFFF00'], category: 'quirky' },
  { name: 'Miami Vice', colors: ['#FF0080', '#00FFFF', '#FF69B4'], category: 'quirky' },
  { name: 'Forest', colors: ['#006400', '#228B22', '#ADFF2F'], category: 'quirky' },
  { name: 'Cherry Blossom', colors: ['#FFB6C1', '#FFFFFF', '#FFC0CB'], category: 'quirky' },
  { name: 'Wine', colors: ['#4B0082', '#800080', '#DC143C'], category: 'quirky' },
  { name: 'Coffee', colors: ['#3C2415', '#8B4513', '#DEB887'], category: 'quirky' },
  { name: 'Citrus', colors: ['#FF8C00', '#FFFF00', '#32CD32'], category: 'quirky' },
  { name: 'Berry', colors: ['#8B008B', '#FF1493', '#FF6347'], category: 'quirky' },
  { name: 'Emerald', colors: ['#006400', '#50C878'], category: 'quirky' },
  { name: 'Ruby', colors: ['#8B0000', '#FF0000', '#FF69B4'], category: 'quirky' },
  { name: 'Amethyst', colors: ['#4B0082', '#9966CC'], category: 'quirky' },
  { name: 'Dawn', colors: ['#191970', '#FF1493', '#FF8C00', '#FFFF00'], category: 'quirky' },
  { name: 'Desert', colors: ['#DEB887', '#FF8C00', '#DC143C'], category: 'quirky' },
  { name: 'Autumn', colors: ['#DC143C', '#FF8C00', '#FFD700', '#8B4513'], category: 'quirky' },
  { name: 'Neon Sign', colors: ['#FF1493', '#FF8C00', '#FFFF00'], category: 'quirky' },
  { name: 'Circuit', colors: ['#00FF00', '#FFFF00'], category: 'quirky' },
  { name: 'Arcade', colors: ['#0080FF', '#8000FF', '#FF1493'], category: 'quirky' }
];

export const DEFAULT_COLORS = {
  start: '#FF3300',
  end: '#FFFF00'
};

export const COPY_FEEDBACK_DURATION = 2000;
export const MAX_TEXT_LENGTH = 500;
export const DEBOUNCE_DELAY = 300;

export const KEYBOARD_SHORTCUTS = {
  COPY: 'ctrl+c',
  CLEAR: 'ctrl+shift+c',
  FOCUS_TEXT: 'ctrl+/',
} as const; 